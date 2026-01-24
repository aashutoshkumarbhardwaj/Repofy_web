class MealAnalysis {
  final String mealType;
  final List<String> ingredients;
  final double calories;
  final double protein;
  final double carbs;
  final double fat;
  final double carbonFootprint;
  final String imagePath;

  MealAnalysis({
    required this.mealType,
    required this.ingredients,
    required this.calories,
    required this.protein,
    required this.carbs,
    required this.fat,
    required this.carbonFootprint,
    required this.imagePath,
  });

  factory MealAnalysis.fromJson(Map<String, dynamic> json) {
    return MealAnalysis(
      mealType: json['mealType'] ?? '',
      ingredients: List<String>.from(json['ingredients'] ?? []),
      calories: json['calories']?.toDouble() ?? 0.0,
      protein: json['protein']?.toDouble() ?? 0.0,
      carbs: json['carbs']?.toDouble() ?? 0.0,
      fat: json['fat']?.toDouble() ?? 0.0,
      carbonFootprint: json['carbonFootprint']?.toDouble() ?? 0.0,
      imagePath: json['imagePath'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'mealType': mealType,
      'ingredients': ingredients,
      'calories': calories,
      'protein': protein,
      'carbs': carbs,
      'fat': fat,
      'carbonFootprint': carbonFootprint,
      'imagePath': imagePath,
    };
  }
}