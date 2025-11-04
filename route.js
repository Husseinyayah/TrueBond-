import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const {
      uid,
      traits,
      values,
      datingGoals,
      conversationStyle,
      dealBreakers,
    } = await request.json();

    // Validate required fields
    if (!uid || !datingGoals) {
      return Response.json(
        {
          error: "UID and dating goals are required",
        },
        { status: 400 },
      );
    }

    // Create compatibility score vectors based on answers
    const scoreVectors = {
      extroversion: traits?.extroversion || 0.5,
      openness: traits?.openness || 0.5,
      conscientiousness: traits?.conscientiousness || 0.5,
      agreeableness: traits?.agreeableness || 0.5,
      emotionalStability: traits?.emotionalStability || 0.5,
      familyOriented: values?.familyOriented || 0.5,
      careerFocused: values?.careerFocused || 0.5,
      adventurous: values?.adventurous || 0.5,
      spiritual: values?.spiritual || 0.5,
    };

    // Save or update quiz results
    const existingQuiz = await sql`
      SELECT uid FROM quiz_results WHERE uid = ${uid}
    `;

    let quizResult;
    if (existingQuiz.length > 0) {
      // Update existing
      quizResult = await sql`
        UPDATE quiz_results 
        SET 
          traits = ${JSON.stringify(traits || {})},
          values = ${JSON.stringify(values || {})},
          score_vectors = ${JSON.stringify(scoreVectors)},
          dating_goals = ${datingGoals},
          conversation_style = ${conversationStyle || null},
          deal_breakers = ${JSON.stringify(dealBreakers || [])},
          updated_at = NOW()
        WHERE uid = ${uid}
        RETURNING *
      `;
    } else {
      // Create new
      quizResult = await sql`
        INSERT INTO quiz_results (
          uid, traits, values, score_vectors, dating_goals, 
          conversation_style, deal_breakers, created_at, updated_at
        )
        VALUES (
          ${uid}, ${JSON.stringify(traits || {})}, ${JSON.stringify(values || {})},
          ${JSON.stringify(scoreVectors)}, ${datingGoals}, ${conversationStyle || null},
          ${JSON.stringify(dealBreakers || [])}, NOW(), NOW()
        )
        RETURNING *
      `;
    }

    return Response.json({
      quiz: quizResult[0],
      message: "Quiz results saved successfully",
    });
  } catch (error) {
    console.error("Quiz save error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
