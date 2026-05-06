import { NextResponse } from 'next/server';

// Mock quiz data storage (replace with database in production)
const quizStore = new Map();
const quizResultsStore = new Map();

export async function GET(request, { params }) {
  const { id } = params;
  
  try {
    // Get quiz questions for the experience
    const quiz = quizStore.get(id) || {
      experienceId: id,
      questions: [
        {
          id: 1,
          question: "What is the primary goal of effective market validation?",
          answers: [
            "To confirm assumptions about customer needs",
            "To build a perfect product immediately",
            "To maximize investor funding",
            "To create a detailed business plan"
          ],
          correctAnswerIndex: 0,
          questionType: 0 // pre-work multiple choice
        },
        {
          id: 2,
          question: "Which method is most effective for understanding customer pain points?",
          answers: [
            "Reading industry reports only",
            "Direct customer interviews and observation",
            "Competitor analysis only",
            "Social media sentiment analysis only"
          ],
          correctAnswerIndex: 1,
          questionType: 0
        }
      ],
      passThreshold: 70, // 70% to pass
      timeLimit: 300 // 5 minutes
    };

    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  const { id } = params;
  
  try {
    const body = await request.json();
    const { answers, userId } = body;

    const quiz = quizStore.get(id);
    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Calculate score
    let correctCount = 0;
    const results = answers.map((answer, index) => {
      const question = quiz.questions[index];
      const isCorrect = answer === question.correctAnswerIndex;
      if (isCorrect) correctCount++;
      
      return {
        questionId: question.id,
        userAnswer: answer,
        correctAnswer: question.correctAnswerIndex,
        isCorrect
      };
    });

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = score >= quiz.passThreshold;

    // Store results
    const resultKey = `${id}-${userId}`;
    quizResultsStore.set(resultKey, {
      experienceId: id,
      userId,
      score,
      passed,
      results,
      completedAt: new Date().toISOString()
    });

    return NextResponse.json({
      score,
      passed,
      results,
      correctCount,
      totalQuestions: quiz.questions.length,
      passThreshold: quiz.passThreshold
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
