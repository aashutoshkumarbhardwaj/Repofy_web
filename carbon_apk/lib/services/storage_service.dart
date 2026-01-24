import 'dart:convert';
import 'dart:io';
import 'package:path_provider/path_provider.dart';
import '../models/daily_log.dart';
import '../models/verdict.dart';

class StorageService {
  static const String _dailyLogsFileName = 'daily_logs.json';
  static const String _verdictsFileName = 'verdicts.json';

  Future<String> get _localPath async {
    final directory = await getApplicationDocumentsDirectory();
    return directory.path;
  }

  Future<File> get _dailyLogsFile async {
    final path = await _localPath;
    return File('$path/$_dailyLogsFileName');
  }

  Future<File> get _verdictsFile async {
    final path = await _localPath;
    return File('$path/$_verdictsFileName');
  }

  // Daily Logs
  Future<void> saveDailyLog(DailyLog dailyLog) async {
    try {
      final file = await _dailyLogsFile;
      List<DailyLog> logs = await loadDailyLogs();
      
      // Remove existing log for the same date
      logs.removeWhere((log) => 
        log.date.year == dailyLog.date.year &&
        log.date.month == dailyLog.date.month &&
        log.date.day == dailyLog.date.day
      );
      
      logs.add(dailyLog);
      
      final jsonString = jsonEncode(logs.map((log) => log.toJson()).toList());
      await file.writeAsString(jsonString);
    } catch (e) {
      throw Exception('Failed to save daily log: $e');
    }
  }

  Future<List<DailyLog>> loadDailyLogs() async {
    try {
      final file = await _dailyLogsFile;
      if (!await file.exists()) {
        return [];
      }
      
      final jsonString = await file.readAsString();
      final List<dynamic> jsonList = jsonDecode(jsonString);
      
      return jsonList.map((json) => DailyLog.fromJson(json)).toList();
    } catch (e) {
      return [];
    }
  }

  Future<DailyLog?> getDailyLog(DateTime date) async {
    final logs = await loadDailyLogs();
    try {
      return logs.firstWhere((log) =>
        log.date.year == date.year &&
        log.date.month == date.month &&
        log.date.day == date.day
      );
    } catch (e) {
      return null;
    }
  }

  // Verdicts
  Future<void> saveVerdict(Verdict verdict) async {
    try {
      final file = await _verdictsFile;
      List<Verdict> verdicts = await loadVerdicts();
      
      verdicts.add(verdict);
      
      final jsonString = jsonEncode(verdicts.map((v) => v.toJson()).toList());
      await file.writeAsString(jsonString);
    } catch (e) {
      throw Exception('Failed to save verdict: $e');
    }
  }

  Future<List<Verdict>> loadVerdicts() async {
    try {
      final file = await _verdictsFile;
      if (!await file.exists()) {
        return [];
      }
      
      final jsonString = await file.readAsString();
      final List<dynamic> jsonList = jsonDecode(jsonString);
      
      return jsonList.map((json) => Verdict.fromJson(json)).toList();
    } catch (e) {
      return [];
    }
  }

  Future<void> clearAllData() async {
    try {
      final dailyLogsFile = await _dailyLogsFile;
      final verdictsFile = await _verdictsFile;
      
      if (await dailyLogsFile.exists()) {
        await dailyLogsFile.delete();
      }
      
      if (await verdictsFile.exists()) {
        await verdictsFile.delete();
      }
    } catch (e) {
      throw Exception('Failed to clear data: $e');
    }
  }
}