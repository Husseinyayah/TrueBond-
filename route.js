import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { fromUid, toUid, likeType } = await request.json();

    // Validate required fields
    if (!fromUid || !toUid) {
      return Response.json(
        {
          error: "From UID and To UID are required",
        },
        { status: 400 },
      );
    }

    // Check if already liked
    const existingLike = await sql`
      SELECT * FROM likes WHERE from_uid = ${fromUid} AND to_uid = ${toUid}
    `;

    if (existingLike.length > 0) {
      return Response.json(
        { error: "Already liked this profile" },
        { status: 409 },
      );
    }

    // Record the like
    const newLike = await sql`
      INSERT INTO likes (from_uid, to_uid, like_type, created_at)
      VALUES (${fromUid}, ${toUid}, ${likeType || "like"}, NOW())
      RETURNING *
    `;

    // Check if it's a mutual like (match)
    const mutualLike = await sql`
      SELECT * FROM likes 
      WHERE from_uid = ${toUid} AND to_uid = ${fromUid} 
      AND like_type IN ('like', 'super')
    `;

    let match = null;
    if (mutualLike.length > 0) {
      // Create match
      const matchId = `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const newMatch = await sql`
        INSERT INTO matches (match_id, uid1, uid2, created_at, status)
        VALUES (${matchId}, ${fromUid}, ${toUid}, NOW(), 'active')
        RETURNING *
      `;

      // Create chat for the match
      await sql`
        INSERT INTO chats (match_id, unread_counts, created_at, updated_at)
        VALUES (${matchId}, '{}', NOW(), NOW())
      `;

      // Get both profiles for match details
      const profiles = await sql`
        SELECT uid, display_name, photos 
        FROM profiles 
        WHERE uid IN (${fromUid}, ${toUid})
      `;

      match = {
        ...newMatch[0],
        profiles: profiles,
      };
    }

    return Response.json({
      like: newLike[0],
      match: match,
      isMatch: !!match,
      message: match ? "It's a match!" : "Like recorded successfully",
    });
  } catch (error) {
    console.error("Like error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
