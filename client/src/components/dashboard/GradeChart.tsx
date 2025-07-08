import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export function GradeChart() {
  const data = [
    { name: 'Excellent (16-20)', value: 25, color: '#10b981' },
    { name: 'Bien (14-16)', value: 35, color: '#3b82f6' },
    { name: 'Assez Bien (12-14)', value: 20, color: '#f59e0b' },
    { name: 'Passable (10-12)', value: 15, color: '#ef4444' },
    { name: 'Insuffisant (<10)', value: 5, color: '#64748b' },
  ];

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#64748b'];

  return (
    <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <CardHeader className="border-b border-slate-200 dark:border-slate-700">
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Distribution des Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
