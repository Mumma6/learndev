import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  RadialLinearScale,
  Title,
  Tooltip
} from "chart.js"

export const registerChartJs = () => {
  Chart.register(
    ArcElement,
    BarElement,
    CategoryScale,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    RadialLinearScale,
    Filler
  )
}
