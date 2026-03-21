export default function TableSection() {
  const rows = [
    {
      faixa: "Até R$ 2.259,20",
      aliq: "Isento",
      deducao: "-",
      badgeClass: "b0",
    },
    {
      faixa: "De R$ 2.259,21 até R$ 2.828,65",
      aliq: "7,5%",
      deducao: "R$ 169,44",
      badgeClass: "b75",
    },
    {
      faixa: "De R$ 2.828,66 até R$ 3.751,05",
      aliq: "15,0%",
      deducao: "R$ 381,44",
      badgeClass: "b15",
    },
    {
      faixa: "De R$ 3.751,06 até R$ 4.664,68",
      aliq: "22,5%",
      deducao: "R$ 662,77",
      badgeClass: "b22",
    },
    {
      faixa: "Acima de R$ 4.664,68",
      aliq: "27,5%",
      deducao: "R$ 896,00",
      badgeClass: "b27",
    },
  ];

  return (
    <section className="table-section">
      <div className="table-inner">
        <div className="table-header">
          <span className="section-tag">Tabela Progressiva</span>
          <h2>Faixas de Tributação IRPF 2026</h2>
          <p>Alíquotas e parcelas a deduzir conforme o rendimento mensal tributável.</p>
        </div>

        <table className="alq-table">
          <thead>
            <tr>
              <th className="text-left py-4 px-0 font-bold text-deep/60 uppercase text-xs">Base de Cálculo Mensal</th>
              <th className="text-left py-4 px-0 font-bold text-deep/60 uppercase text-xs">Alíquota</th>
              <th className="text-left py-4 px-0 font-bold text-deep/60 uppercase text-xs">Parcela a Deduzir</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                <td>{row.faixa}</td>
                <td>
                  <span className={`alq-badge ${row.badgeClass}`}>{row.aliq}</span>
                </td>
                <td>{row.deducao}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
