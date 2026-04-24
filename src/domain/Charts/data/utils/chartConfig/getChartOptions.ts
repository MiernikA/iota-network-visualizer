export function getChartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index" as const, intersect: false },
    plugins: {
      legend: {
        labels: {
          color: "#e5eef8",
          boxWidth: 12,
          boxHeight: 12,
          padding: 14,
          font: {
            size: 12,
            weight: 600,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(2, 6, 23, 0.94)",
        titleColor: "#f8fafc",
        bodyColor: "#e2e8f0",
        borderColor: "rgba(148, 163, 184, 0.28)",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: { color: "#cbd5e1" },
        grid: { color: "rgba(148,163,184,0.16)" },
        border: { color: "rgba(148,163,184,0.24)" },
      },
      y: {
        ticks: { color: "#cbd5e1" },
        grid: { color: "rgba(148,163,184,0.16)" },
        border: { color: "rgba(148,163,184,0.24)" },
      },
    },
  };
}
