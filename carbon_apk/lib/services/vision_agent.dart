import '../models/meal_analysis.dart';

class VisionAgent {
  Future<MealAnalysis> analyzeMealImage(String imagePath) async {
    // Simulate image analysis delay
    await Future.delayed(Duration(seconds: 2));

    // Mock analysis results (in real app, this would use ML/AI vision services)
    return _generateMockAnalysis(imagePath);
  }

  MealAnalysis _generateMockAnalysis(String imagePath) {
    // Generate mock data based on image path or random values
    // In a real implementation, this would analyze the actual image
    
    List<List<String>> sampleMeals = [
      ['chicken breast', 'broccoli', 'rice'],
      ['salmon', 'quinoa', 'asparagus'],
      ['pasta', 'tomato sauce', 'basil'],
      ['salad', 'chicken', 'avocado', 'olive oil'],
      ['oatmeal', 'banana', 'almonds'],
      ['eggs', 'toast', 'spinach'],
    ];

    List<String> mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
    
    // Select random meal data
    final random = DateTime.now().millisecondsSinceEpoch % sampleMeals.length;
    final ingredients = sampleMeals[random];
    final mealType = mealTypes[random % mealTypes.length];

    // Calculate mock nutritional values
    double calories = _calculateMockCalories(ingredients);
    double protein = calories * 0.25 / 4; // 25% of calories from protein
    double carbs = calories * 0.45 / 4;   // 45% of calories from carbs
    double fat = calories * 0.30 / 9;     // 30% of calories from fat
    double carbonFootprint = _calculateMockCarbonFootprint(ingredients);

    return MealAnalysis(
      mealType: mealType,
      ingredients: ingredients,
      calories: calories,
      protein: protein,
      carbs: carbs,
      fat: fat,
      carbonFootprint: carbonFootprint,
      imagePath: imagePath,
    );
  }

  double _calculateMockCalories(List<String> ingredients) {
    // Mock calorie calculation based on ingredients
    Map<String, double> calorieMap = {
      'chicken breast': 165,
      'salmon': 208,
      'pasta': 131,
      'rice': 130,
      'quinoa': 120,
      'broccoli': 25,
      'asparagus': 20,
      'salad': 15,
      'avocado': 160,
      'eggs': 155,
      'oatmeal': 68,
      'banana': 89,
      'almonds': 164,
      'toast': 79,
      'spinach': 7,
    };

    double totalCalories = 0;
    for (String ingredient in ingredients) {
      totalCalories += calorieMap[ingredient] ?? 50; // Default 50 calories
    }

    return totalCalories;
  }

  double _calculateMockCarbonFootprint(List<String> ingredients) {
    // Mock carbon footprint calculation (kg CO2 equivalent)
    Map<String, double> carbonMap = {
      'chicken breast': 2.3,
      'salmon': 2.9,
      'pasta': 0.7,
      'rice': 1.2,
      'quinoa': 0.8,
      'broccoli': 0.2,
      'asparagus': 0.1,
      'salad': 0.1,
      'avocado': 0.3,
      'eggs': 1.4,
      'oatmeal': 0.3,
      'banana': 0.1,
      'almonds': 1.1,
      'toast': 0.4,
      'spinach': 0.1,
    };

    double totalCarbon = 0;
    for (String ingredient in ingredients) {
      totalCarbon += carbonMap[ingredient] ?? 0.5; // Default 0.5 kg CO2
    }

    return totalCarbon;
  }

  Future<bool> validateImageQuality(String imagePath) async {
    // Mock image quality validation
    await Future.delayed(Duration(milliseconds: 500));
    return true; // Always return true for mock
  }

  Future<List<String>> extractIngredients(String imagePath) async {
    // Mock ingredient extraction
    final analysis = await analyzeMealImage(imagePath);
    return analysis.ingredients;
  }
}