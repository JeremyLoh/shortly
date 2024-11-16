import "./AppFeatureSummary.css"
import FeatureCard from "../FeatureCard/FeatureCard"
import { GiHandWing } from "react-icons/gi"
import { AiFillLock } from "react-icons/ai"
import { MdHistory } from "react-icons/md"

const FEATURES = [
  {
    id: "feature-1",
    title: "Easy to use",
    description: "Just enter your long link and create your shortened link!",
    icon: <GiHandWing size={48} />,
  },
  {
    id: "feature-2",
    title: "Safe",
    description: "Stop malicious links from being shortened",
    icon: <AiFillLock size={48} />,
  },
  {
    id: "feature-3",
    title: "History",
    description: "Create an account to view created short urls",
    icon: <MdHistory size={48} />,
  },
]

function AppFeatureSummary() {
  return (
    <div className="app-feature-summary">
      {FEATURES.map((feature) => (
        <FeatureCard
          key={feature.id}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </div>
  )
}

export default AppFeatureSummary
