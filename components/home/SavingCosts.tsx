import dynamic from 'next/dynamic'
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { setApiCalls, setInputTokens, setOutputTokens } from '@/lib/features/SavingCosts/SavingCosts';
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useEffect, useState, useCallback } from 'react';

function SavingCosts() {
  const dispatch = useAppDispatch();
  const { apiCalls, inputTokens, outputTokens } = useAppSelector(state => state.savingCosts);

  const [calculatedValues, setCalculatedValues] = useState({
    ourTotalCost: 0,
    competitorTotalCost: 0,
    savings: 0,
    annualSavings: 0,
  });

  const [animatedSavings, setAnimatedSavings] = useState(0);
  const [indicatorWidth, setIndicatorWidth] = useState(0);

  const ourInputCost = 0.00125 
  const ourOutputCost = 0.00375 
  const competitorInputCost = 0.005 
  const competitorOutputCost = 0.015 

  const calculateCost = useCallback((calls: number, inputTokens: number, outputTokens: number, inputCost: number, outputCost: number) => {
    return (calls * inputTokens * inputCost / 1000) + (calls * outputTokens * outputCost / 1000)
  }, []);

  useEffect(() => {
    const ourTotalCost = calculateCost(apiCalls, inputTokens, outputTokens, ourInputCost, ourOutputCost);
    const competitorTotalCost = calculateCost(apiCalls, inputTokens, outputTokens, competitorInputCost, competitorOutputCost);
    const savings = competitorTotalCost - ourTotalCost;
    const annualSavings = savings * 365;

    setCalculatedValues({ ourTotalCost, competitorTotalCost, savings, annualSavings });
  }, [apiCalls, inputTokens, outputTokens, calculateCost]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedSavings((prev) => {
        const diff = calculatedValues.savings - prev;
        return Math.abs(diff) < 0.01 ? calculatedValues.savings : prev + diff / 10;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [calculatedValues.savings]);

  useEffect(() => {
    if (apiCalls > 0) {
      const widthPercentage = ((apiCalls - 100) / (10000 - 100)) * 100;
      setIndicatorWidth(Math.max(5, Math.min(widthPercentage, 100)));
    } else {
      setIndicatorWidth(0);
    }
  }, [apiCalls]);
  
  return (
    <Card className="w-full max-w-2xl mx-auto bg-neutral-900 text-gray-100">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">GPT-4o Cost Savings With Naga</CardTitle>
          <Badge variant="secondary" className="text-xs bg-neutral-700 text-gray-100">GPT-4o</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-calls" className="text-sm font-medium text-gray-300">
            API Calls per Day: {apiCalls.toLocaleString()}
          </Label>
          <Slider
            id="api-calls"
            min={100}
            max={10000}
            step={100}
            value={[apiCalls]}
            onValueChange={(value) => dispatch(setApiCalls(value[0]))}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="input-tokens" className="text-xs font-medium text-gray-300">Input Tokens</Label>
            <Input
              id="input-tokens"
              type="number"
              min={1}
              max={10000}
              value={inputTokens}
              onChange={(e) => dispatch(setInputTokens(Number(e.target.value)))}
              className="bg-neutral-800 text-gray-100 border-gray-700 h-8 text-sm"
            />
          </div>
          <div>
            <Label htmlFor="output-tokens" className="text-xs font-medium text-gray-300">Output Tokens</Label>
            <Input
              id="output-tokens"
              type="number"
              min={1}
              max={10000}
              value={outputTokens}
              onChange={(e) => dispatch(setOutputTokens(Number(e.target.value)))}
              className="bg-neutral-800 text-gray-100 border-gray-700 h-8 text-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-neutral-800 p-2 rounded">
            <div className="text-xs text-gray-400">Our Cost</div>
            <div className="text-lg font-bold">${calculatedValues.ourTotalCost.toFixed(2)}</div>
          </div>
          <div className="bg-neutral-800 p-2 rounded">
            <div className="text-xs text-gray-400">OAI</div>
            <div className="text-lg font-bold">${calculatedValues.competitorTotalCost.toFixed(2)}</div>
          </div>
          <div className="bg-neutral-800 p-2 rounded relative overflow-hidden">
            <div className="text-xs text-gray-400">Daily Savings</div>
            <div className="text-lg font-bold text-green-400">${animatedSavings.toFixed(2)}</div>
            <div 
              className="absolute bottom-0 left-0 h-1 bg-green-500 transition-all duration-500 ease-in-out"
              style={{ width: `${indicatorWidth}%` }}
            />
          </div>
        </div>
        <div className="bg-neutral-800 p-2 rounded text-center">
          <div className="text-xs text-gray-400">Estimated Annual Savings</div>
          <div className="text-2xl font-bold text-green-400">${calculatedValues.annualSavings.toFixed(2)}</div>
        </div>
        <div className="text-xs text-gray-400 space-y-1">
          <p>Our rates: ${(ourInputCost * 1000).toFixed(5)}/1M input, ${(ourOutputCost * 1000).toFixed(5)}/1M output</p>
          <p>OAI: ${(competitorInputCost * 1000).toFixed(5)}/1M input, ${(competitorOutputCost * 1000).toFixed(5)}/1M output</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default dynamic(() => Promise.resolve(SavingCosts), { ssr: false })
