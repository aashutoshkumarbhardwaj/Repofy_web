class NutritionAssessment {
  final double totalCalories;
  final double totalProtein;
  final double totalCarbs;
  final double totalFat;
  final double dailyCalorieGoal;
  final String healthScore;
  final List<String> deficiencies;
  final List<String> recommendations;

  NutritionAssessment({
    required this.totalCalories,
    required this.totalProtein,
    required this.totalCarbs,
    required this.totalFat,
    required this.dailyCalorieGoal,
    required this.healthScore,
    required this.deficiencies,
    required this.recommendations,
  });

  factory NutritionAssessment.fromJson(Map<String, dynamic> json) {
    return NutritionAssessment(
      totalCalories: json['totalCalories']?.toDouble() ?? 0.0,
      totalProtein: json['totalProtein']?.toDouble() ?? 0.0,
      totalCarbs: json['totalCarbs']?.toDouble() ?? 0.0,
      totalFat: json['totalFat']?.toDouble() ?? 0.0,
      dailyCalorieGoal: json['dailyCalorieGoal']?.toDouble() ?? 2000.0,
      healthScore: json['healthScore'] ?? '',
      deficiencies: List<String>.from(json['deficiencies'] ?? []),
      recommendations: List<String>.from(json['recommendations'] ?? []),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'totalCalories': totalCalories,
      'totalProtein': totalProtein,
      'totalCarbs': totalCarbs,
      'totalFat': totalFat,
      'dailyCalorieGoal': dailyCalorieGoal,
      'healthScore': healthScore,
      'deficiencies': deficiencies,
      'recommendations': recommendations,
    };
  }
}