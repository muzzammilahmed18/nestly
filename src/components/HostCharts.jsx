import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line,
  PieChart, Pie, Cell, Legend,
  ResponsiveContainer,
} from "recharts";

// Updated colors to match the premium theme:
// Emerald for confirmed/money, soft gray for cancelled.
const STATUS_COLORS = { CONFIRMED: "#059669", CANCELLED: "#e5e7eb" };
const BRAND_ORANGE = "#ea580c"; // Tailwind orange-600

// All charts are derived client-side from the bookings list the
// dashboard already fetched — no extra API calls needed just to
// visualize data that's already sitting in memory.
export default function HostCharts({ bookings }) {
  const bookingsByListing = useMemo(() => {
    const counts = {};
    bookings
      .filter((b) => b.status === "CONFIRMED")
      .forEach((b) => {
        counts[b.listing.title] = (counts[b.listing.title] || 0) + 1;
      });
    return Object.entries(counts).map(([title, count]) => ({ title, count }));
  }, [bookings]);

  const revenueOverTime = useMemo(() => {
    const totals = {};
    bookings
      .filter((b) => b.status === "CONFIRMED")
      .forEach((b) => {
        const month = b.checkIn.slice(0, 7);
        totals[month] = (totals[month] || 0) + b.totalPrice;
      });
    return Object.entries(totals)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, revenue]) => ({ month, revenue }));
  }, [bookings]);

  const statusBreakdown = useMemo(() => {
    const counts = { CONFIRMED: 0, CANCELLED: 0 };
    bookings.forEach((b) => { counts[b.status] = (counts[b.status] || 0) + 1; });
    return Object.entries(counts)
      .filter(([, count]) => count > 0)
      .map(([status, value]) => ({ status, value }));
  }, [bookings]);

  if (bookings.length === 0) return null;

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      
      {/* Bar Chart: Bookings by listing */}
      <div className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 rounded-2xl p-6">
        <h3 className="font-bold text-gray-900 mb-6 text-base tracking-tight">Bookings by listing</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={bookingsByListing} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="title" 
              tick={{ fontSize: 11, fill: '#64748b' }} 
              interval={0} 
              angle={-25} 
              textAnchor="end" 
              height={50} 
              axisLine={false} 
              tickLine={false} 
            />
            <YAxis 
              allowDecimals={false} 
              tick={{ fontSize: 12, fill: '#64748b' }} 
              axisLine={false} 
              tickLine={false} 
            />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="count" fill={BRAND_ORANGE} radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart: Booking status */}
      <div className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 rounded-2xl p-6">
        <h3 className="font-bold text-gray-900 mb-6 text-base tracking-tight">Booking status</h3>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Pie 
              data={statusBreakdown} 
              dataKey="value" 
              nameKey="status" 
              cx="50%" 
              cy="45%" 
              innerRadius={60} 
              outerRadius={90} 
              paddingAngle={2}
              stroke="none"
            >
              {statusBreakdown.map((entry) => (
                <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', color: '#64748b' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart: Revenue */}
      <div className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 rounded-2xl p-6 lg:col-span-2">
        <h3 className="font-bold text-gray-900 mb-6 text-base tracking-tight">Revenue over time</h3>
        {revenueOverTime.length === 0 ? (
          <div className="flex items-center justify-center h-48 bg-gray-50 rounded-xl">
            <p className="text-sm font-medium text-gray-400">Not enough data yet to chart a trend.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={revenueOverTime} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12, fill: '#64748b' }} 
                axisLine={false} 
                tickLine={false} 
                dy={10}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#64748b' }} 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => [`$${value}`, 'Revenue']}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke={STATUS_COLORS.CONFIRMED} 
                strokeWidth={3} 
                dot={{ r: 4, fill: STATUS_COLORS.CONFIRMED, strokeWidth: 2, stroke: '#fff' }} 
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
      
    </div>
  );
}