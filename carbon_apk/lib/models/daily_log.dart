import 'carbon_impact.dart';
import 'meal_analysis.dart';
import 'nutrition_assessment.dart';

class DailyLog {
  final DateTime date;
  final List<MealAnalysis> meals;
  final CarbonImpact carbonImpact;
  final NutritionAssessment nutritionAssessment;
  final String commuteMethod;
  final double commuteDistance;

  DailyLog({
    required this.date,
    required this.meals,
    required this.carbonImpact,
    required this.nutritionAssessment,
    required this.commuteMethod,
    required this.commuteDistance,
  });

  factory DailyLog.fromJson(Map<String, dynamic> json) {
    return DailyLog(
      date: DateTime.parse(json['date']),
      meals: (json['meals'] as List)
          .map((meal) => MealAnalysis.fromJson(meal))
          .toList(),
      carbonImpact: CarbonImpact.fromJson(json['carbonImpact']),
      nutritionAssessment: NutritionAssessment.fromJson(json['nutritionAssessment']),
      commuteMethod: json['commuteMethod'] ?? '',
      commuteDistance: json['commuteDistance']?.toDouble() ?? 0.0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'date': date.toIso8601String(),
      'meals': meals.map((meal) => meal.toJson()).toList(),
      'carbonImpact': carbonImpact.toJson(),
      'nutritionAssessment': nutritionAssessment.toJson(),
      'commuteMethod': commuteMethod,
      'commuteDistance': commuteDistance,
    };
  }
}