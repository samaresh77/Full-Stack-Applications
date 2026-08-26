function StatusBadge({ status }) {
  const className = `status-badge status-${status
    .toLowerCase()
    .replace(" ", "-")}`;


  return (
    <span className={className}>
      {status}
    </span>
  );
}


export default StatusBadge;