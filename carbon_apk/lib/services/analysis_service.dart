import '../models/daily_log.dart';
import '../models/meal_analysis.dart';
import 'vision_agent.dart';
import 'nutrition_agent.dart';
import 'carbon_agent.dart';
import 'decision_agent.dart';
import 'verdict_agent.dart';

class AnalysisService {
  final VisionAgent _visionAgent = VisionAgent();
  final NutritionAgent _nutritionAgent = NutritionAgent();
  final CarbonAgent _carbonAgent = CarbonAgent();
  final DecisionAgent _decisionAgent = DecisionAgent();
  final VerdictAgent _verdictAgent = VerdictAgent();

  Future<DailyLog> analyzeDailyData({
    required List<String> mealImages,
    required String commuteMethod,
    required double commuteDistance,
  }) async {
    try {
      // Analyze meal images
      List<MealAnalysis> meals = [];
      for (String imagePath in mealImages) {
        final mealAnalysis = await _visionAgent.analyzeMealImage(imagePath);
        meals.add(mealAnalysis);
      }

      // Get nutrition assessment
      final nutritionAssessment = await _nutritionAgent.assessNutrition(meals);

      // Calculate carbon impact
      final carbonImpact = await _carbonAgent.calculateCarbonImpact(
        meals: meals,
        commuteMethod: commuteMethod,
        commuteDistance: commuteDistance,
      );

      // Generate daily log
      final dailyLog = DailyLog(
        date: DateTime.now(),
        meals: meals,
        carbonImpact: carbonImpact,
        nutritionAssessment: nutritionAssessment,
        commuteMethod: commuteMethod,
        commuteDistance: commuteDistance,
      );

      return dailyLog;
    } catch (e) {
      throw Exception('Failed to analyze daily data: $e');
    }
  }

  Future<void> generateVerdict(DailyLog dailyLog) async {
    await _verdictAgent.generateVerdict(dailyLog);
  }
}