import "./FeatureCard.css"

type FeatureCardProps = {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="feature-card">
      {icon}
      <p className="feature-card-title">{title}</p>
      <p className="feature-card-description">{description}</p>
    </div>
  )
}

export default FeatureCard
