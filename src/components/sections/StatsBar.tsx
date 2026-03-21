export default function StatsBar() {
  return (
    <div className="stats-bar">
      <div className="stats-inner">
        <div className="stat-item">
          <span className="stat-num">R$ 35.584</span>
          <span className="stat-label">Limite renda trib. anual — Art. 2º, I</span>
        </div>
        <div className="stat-item">
          <span className="stat-num">R$ 800 mil</span>
          <span className="stat-label">Limite patrimônio — Art. 2º, VI</span>
        </div>
        <div className="stat-item">
          <span className="stat-num">27,5%</span>
          <span className="stat-label">Alíquota máxima IRPF</span>
        </div>
        <div className="stat-item stat-deadline">
          <span className="stat-num">29/05/2026</span>
          <span className="stat-label flex items-center justify-center gap-1">
            <span className="text-red-500">📌</span> Prazo final — entregue até esta data
          </span>
        </div>
      </div>
    </div>
  );
}
