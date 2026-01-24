import '../models/verdict.dart';
import '../models/daily_log.dart';
import 'storage_service.dart';

class VerdictAgent {
  final StorageService _storageService = StorageService();

  Future<Verdict> generateVerdict(DailyLog dailyLog) async {
    // Calculate individual scores
    Map<String, double> scores = {
      'nutrition': _calculateNutritionScore(dailyLog),
      'carbon': _calculateCarbonScore(dailyLog),
      'balance': _calculateBalanceScore(dailyLog),
    };

    // Calculate overall score
    double overallScoreValue = scores.values.reduce((a, b) => a + b) / scores.length;
    String overallScore = _getScoreGrade(overallScoreValue);

    // Generate summary
    String summary = _generateSummary(dailyLog, scores, overallScoreValue);

    // Identify achievements
    List<String> achievements = _identifyAchievements(dailyLog, scores);

    // Suggest improvements
    List<String> improvements = _suggestImprovements(dailyLog, scores);

    final verdict = Verdict(
      overallScore: overallScore,
      summary: summary,
      achievements: achievements,
      improvements: improvements,
      scores: scores,
      timestamp: DateTime.now(),
    );

    // Save verdict
    await _storageService.saveVerdict(verdict);

    return verdict;
  }

  double _calculateNutritionScore(DailyLog dailyLog) {
    final nutrition = dailyLog.nutritionAssessment;
    double calorieRatio = nutrition.totalCalories / nutrition.dailyCalorieGoal;
    
    // Optimal range is 0.9 to 1.1 of daily goal
    if (calorieRatio >= 0.9 && calorieRatio <= 1.1) {
      return 90.0;
    } else if (calorieRatio >= 0.8 && calorieRatio <= 1.2) {
      return 75.0;
    } else {
      return 50.0;
    }
  }

  double _calculateCarbonScore(DailyLog dailyLog) {
    final carbon = dailyLog.carbonImpact;
    
    if (carbon.totalEmissions < 5.0) {
      return 95.0;
    } else if (carbon.totalEmissions < 10.0) {
      return 75.0;
    } else if (carbon.totalEmissions < 15.0) {
      return 60.0;
    } else {
      return 40.0;
    }
  }

  double _calculateBalanceScore(DailyLog dailyLog) {
    // Score based on meal variety and timing
    int mealCount = dailyLog.meals.length;
    
    if (mealCount >= 3) {
      return 85.0;
    } else if (mealCount == 2) {
      return 70.0;
    } else {
      return 50.0;
    }
  }

  String _getScoreGrade(double score) {
    if (score >= 90) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 80) return 'B+';
    if (score >= 75) return 'B';
    if (score >= 70) return 'C+';
    if (score >= 65) return 'C';
    return 'D';
  }

  String _generateSummary(DailyLog dailyLog, Map<String, double> scores, double overallScore) {
    String grade = _getScoreGrade(overallScore);
    
    if (overallScore >= 85) {
      return 'Excellent day! You maintained a great balance between nutrition and environmental impact. Grade: $grade';
    } else if (overallScore >= 75) {
      return 'Good day overall with room for minor improvements. Grade: $grade';
    } else if (overallScore >= 65) {
      return 'Decent day, but there are several areas where you can improve. Grade: $grade';
    } else {
      return 'Today had some challenges. Focus on the improvement suggestions for tomorrow. Grade: $grade';
    }
  }

  List<String> _identifyAchievements(DailyLog dailyLog, Map<String, double> scores) {
    List<String> achievements = [];
    
    if (scores['nutrition']! >= 85) {
      achievements.add('Met your nutritional goals');
    }
    
    if (scores['carbon']! >= 85) {
      achievements.add('Maintained low carbon footprint');
    }
    
    if (dailyLog.meals.length >= 3) {
      achievements.add('Logged all your meals');
    }
    
    if (dailyLog.carbonImpact.totalEmissions < 5.0) {
      achievements.add('Eco-friendly day');
    }
    
    return achievements;
  }

  List<String> _suggestImprovements(DailyLog dailyLog, Map<String, double> scores) {
    List<String> improvements = [];
    
    if (scores['nutrition']! < 75) {
      improvements.add('Focus on meeting your daily calorie and macro goals');
    }
    
    if (scores['carbon']! < 75) {
      improvements.add('Consider more sustainable food and transport choices');
    }
    
    if (dailyLog.meals.length < 3) {
      improvements.add('Try to log all your meals for better tracking');
    }
    
    if (improvements.isEmpty) {
      improvements.add('Keep up the great work!');
    }
    
    return improvements;
  }
}