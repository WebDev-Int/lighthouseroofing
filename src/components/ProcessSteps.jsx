const steps = [
  {
    title: 'Inspect & advise',
    description: 'Drone + on-roof check, photos, and scope options.',
  },
  {
    title: 'Plan & protect',
    description: 'Materials staged, landscaping covered, daily safety brief.',
  },
  {
    title: 'Build & verify',
    description: 'Foreman on-site, mid-day check-ins, final walkthrough.',
  },
];

export function ProcessSteps() {
  return (
    <ol className="steps">
      {steps.map((step, i) => (
        <li key={step.title}>
          <span>{i + 1}</span>
          <div>
            <strong>{step.title}</strong>
            <p>{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
