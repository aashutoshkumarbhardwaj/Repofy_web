import '../models/carbon_impact.dart';
import '../models/meal_analysis.dart';

class CarbonAgent {
  static const Map<String, double> _commuteEmissions = {
    'car': 0.21, // kg CO2 per km
    'bus': 0.089,
    'train': 0.041,
    'bike': 0.0,
    'walk': 0.0,
  };

  Future<CarbonImpact> calculateCarbonImpact({
    required List<MealAnalysis> meals,
    required String commuteMethod,
    required double commuteDistance,
  }) async {
    // Calculate food emissions
    double foodEmissions = 0.0;
    for (MealAnalysis meal in meals) {
      foodEmissions += meal.carbonFootprint;
    }

    // Calculate transport emissions
    double transportEmissions = 0.0;
    if (_commuteEmissions.containsKey(commuteMethod.toLowerCase())) {
      transportEmissions = _commuteEmissions[commuteMethod.toLowerCase()]! * commuteDistance * 2; // Round trip
    }

    double totalEmissions = foodEmissions + transportEmissions;

    // Determine category
    String category = _determineCategory(totalEmissions);

    // Generate recommendations
    List<String> recommendations = _generateRecommendations(
      foodEmissions,
      transportEmissions,
      commuteMethod,
    );

    return CarbonImpact(
      totalEmissions: totalEmissions,
      foodEmissions: foodEmissions,
      transportEmissions: transportEmissions,
      category: category,
      recommendations: recommendations,
    );
  }

  String _determineCategory(double totalEmissions) {
    if (totalEmissions < 5.0) return 'Low Impact';
    if (totalEmissions < 10.0) return 'Medium Impact';
    return 'High Impact';
  }

  List<String> _generateRecommendations(
    double foodEmissions,
    double transportEmissions,
    String commuteMethod,
  ) {
    List<String> recommendations = [];

    if (foodEmissions > 5.0) {
      recommendations.add('Consider more plant-based meals to reduce food emissions');
    }

    if (transportEmissions > 3.0 && commuteMethod.toLowerCase() == 'car') {
      recommendations.add('Try using public transport or cycling for your commute');
    }

    if (recommendations.isEmpty) {
      recommendations.add('Great job! Keep up the low-carbon lifestyle');
    }

    return recommendations;
  }
}