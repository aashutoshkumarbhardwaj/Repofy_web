import 'package:flutter/material.dart';
import '../widgets/verdict_card.dart';
import '../widgets/rejected_actions_list.dart';

class ResultScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Results'),
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          children: [
            VerdictCard(),
            SizedBox(height: 16),
            Expanded(
              child: DefaultTabController(
                length: 3,
                child: Column(
                  children: [
                    TabBar(
                      tabs: [
                        Tab(text: 'Nutrition'),
                        Tab(text: 'Carbon'),
                        Tab(text: 'Actions'),
                      ],
                    ),
                    Expanded(
                      child: TabBarView(
                        children: [
                          _buildNutritionTab(),
                          _buildCarbonTab(),
                          RejectedActionsList(),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNutritionTab() {
    return Center(
      child: Text('Nutrition analysis will be displayed here'),
    );
  }

  Widget _buildCarbonTab() {
    return Center(
      child: Text('Carbon impact analysis will be displayed here'),
    );
  }
}