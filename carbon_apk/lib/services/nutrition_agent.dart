import '../models/nutrition_assessment.dart';
import '../models/meal_analysis.dart';

class NutritionAgent {
  Future<NutritionAssessment> assessNutrition(List<MealAnalysis> meals) async {
    double totalCalories = 0.0;
    double totalProtein = 0.0;
    double totalCarbs = 0.0;
    double totalFat = 0.0;

    // Sum up all nutritional values
    for (MealAnalysis meal in meals) {
      totalCalories += meal.calories;
      totalProtein += meal.protein;
      totalCarbs += meal.carbs;
      totalFat += meal.fat;
    }

    // Default daily goals
    double dailyCalorieGoal = 2000.0;
    
    // Calculate health score
    String healthScore = _calculateHealthScore(
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      dailyCalorieGoal,
    );

    // Identify deficiencies
    List<String> deficiencies = _identifyDeficiencies(
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      dailyCalorieGoal,
    );

    // Generate recommendations
    List<String> recommendations = _generateRecommendations(
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      dailyCalorieGoal,
      deficiencies,
    );

    return NutritionAssessment(
      totalCalories: totalCalories,
      totalProtein: totalProtein,
      totalCarbs: totalCarbs,
      totalFat: totalFat,
      dailyCalorieGoal: dailyCalorieGoal,
      healthScore: healthScore,
      deficiencies: deficiencies,
      recommendations: recommendations,
    );
  }

  String _calculateHealthScore(
    double calories,
    double protein,
    double carbs,
    double fat,
    double goal,
  ) {
    double calorieRatio = calories / goal;
    
    if (calorieRatio < 0.8) return 'Below Target';
    if (calorieRatio > 1.2) return 'Above Target';
    
    // Check macronutrient balance
    double proteinPercent = (protein * 4) / calories;
    double carbPercent = (carbs * 4) / calories;
    double fatPercent = (fat * 9) / calories;
    
    if (proteinPercent >= 0.15 && proteinPercent <= 0.25 &&
        carbPercent >= 0.45 && carbPercent <= 0.65 &&
        fatPercent >= 0.20 && fatPercent <= 0.35) {
      return 'Excellent';
    } else if (proteinPercent >= 0.10 && carbPercent >= 0.40 && fatPercent >= 0.15) {
      return 'Good';
    } else {
      return 'Needs Improvement';
    }
  }

  List<String> _identifyDeficiencies(
    double calories,
    double protein,
    double carbs,
    double fat,
    double goal,
  ) {
    List<String> deficiencies = [];
    
    if (calories < goal * 0.8) {
      deficiencies.add('Insufficient calories');
    }
    
    if (protein < goal * 0.15 / 4) {
      deficiencies.add('Low protein intake');
    }
    
    if (carbs < goal * 0.45 / 4) {
      deficiencies.add('Low carbohydrate intake');
    }
    
    return deficiencies;
  }

  List<String> _generateRecommendations(
    double calories,
    double protein,
    double carbs,
    double fat,
    double goal,
    List<String> deficiencies,
  ) {
    List<String> recommendations = [];
    
    if (deficiencies.contains('Insufficient calories')) {
      recommendations.add('Add healthy snacks between meals');
    }
    
    if (deficiencies.contains('Low protein intake')) {
      recommendations.add('Include more lean proteins like chicken, fish, or legumes');
    }
    
    if (deficiencies.contains('Low carbohydrate intake')) {
      recommendations.add('Add whole grains and fruits to your meals');
    }
    
    if (recommendations.isEmpty) {
      recommendations.add('Your nutrition looks balanced! Keep it up');
    }
    
    return recommendations;
  }
}