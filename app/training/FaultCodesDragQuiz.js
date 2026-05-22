'use client'
import { useState, useEffect } from 'react'

const round1 = [
  { code: 'DA0000', en: 'System assigned for perfect orders — arrived on time', es: 'Asignado por el sistema para órdenes perfectas — llegó a tiempo', pt: 'Atribuído pelo sistema para pedidos perfeitos — chegou no prazo' },
  { code: 'DAG101', en: 'Arrival delayed due to Force Majeure (war, extreme weather, pandemic, port strike)', es: 'Llegada retrasada por Fuerza Mayor (guerra, clima extremo, pandemia, huelga portuaria)', pt: 'Chegada atrasada por Força Maior (guerra, clima extremo, pandemia, greve portuária)' },
  { code: 'DAT201', en: 'Carrier\'s delay in making the vehicle available for loading (e.g. vehicle breakdown)', es: 'Retraso del transportista en poner a disposición el vehículo para carga (ej. avería)', pt: 'Atraso da transportadora em disponibilizar o veículo para carregamento (ex. pane)' },
  { code: 'DAT402', en: 'Delayed due to transportation vehicle breakdown (truck, vessel, aircraft)', es: 'Retrasado debido a avería del vehículo de transporte (camión, barco, avión)', pt: 'Atrasado devido a pane do veículo de transporte (caminhão, navio, aeronave)' },
  { code: 'DAT501', en: 'Delayed due to traffic or congestion', es: 'Retrasado debido al tráfico o congestión', pt: 'Atrasado devido ao tráfego ou congestionamento' },
  { code: 'DAT502', en: 'Delayed due to severe or bad weather conditions', es: 'Retrasado debido a clima severo o adverso', pt: 'Atrasado devido a condições climáticas severas ou adversas' },
]

const round2 = [
  { code: 'DAL101', en: 'Arrival delayed at customer site because of delayed departure from factory', es: 'Llegada retrasada en el sitio del cliente debido a salida retrasada de la fábrica', pt: 'Chegada atrasada no local do cliente devido à saída atrasada da fábrica' },
  { code: 'DAA301', en: 'Delayed due to a Production Quality Issue', es: 'Retrasado debido a un problema de calidad de producción', pt: 'Atrasado devido a um problema de qualidade de produção' },
  { code: 'DAC302', en: 'Customer initiates ETA Change Request and TP agrees on a new ETA', es: 'El cliente solicita cambio de ETA y TP acuerda la nueva fecha', pt: 'O cliente solicita alteração de ETA e TP concorda com a nova data' },
  { code: 'DA9991', en: 'Arrival dates at OTM have not yet been entered — enter immediately', es: 'Las fechas de llegada en OTM aún no han sido ingresadas — ingréselas de inmediato', pt: 'As datas de chegada no OTM ainda não foram inseridas — insira imediatamente' },
  { code: 'DA9992', en: 'Arrival dates at OTM have not yet been entered — enter immediately', es: 'Las fechas de llegada en OTM aún no han sido ingresadas — ingréselas de inmediato', pt: 'As datas de chegada no OTM ainda não foram inseridas — insira imediatamente' },
  { code: 'DA9993', en: 'Arrival date entered but reason for anticipation and/or delay was not included — enter the reason in OTM', es: 'Fecha de llegada ingresada pero sin el motivo de anticipación y/o retraso — ingréselo en OTM', pt: 'Data de chegada inserida mas o motivo da antecipação e/ou atraso não foi incluído — insira no OTM' },
]

const txLabels = {
  en: { round: 'Round', of: 'of', dragDesc: 'Drag each description to the correct fault code', check: 'Check Answers', next: 'Next Round →', restart: 'Restart Quiz', correct: 'Correct!', wrong: 'Wrong', score: 'Score', pass: 'Great job! You passed this round.', fail: 'Review the codes and try again.', finalPass: '🎉 Excellent! You matched all fault codes correctly.', finalFail: '📋 Keep practicing — review the fault codes table and try again.' },
  es: { round: 'Ronda', of: 'de', dragDesc: 'Arrastra cada descripción al código de falla correcto', check: 'Verificar Respuestas', next: 'Siguiente Ronda →', restart: 'Reiniciar Quiz', correct: '¡Correcto!', wrong: 'Incorrecto', score: 'Puntuación', pass: '¡Bien hecho! Aprobaste esta ronda.', fail: 'Revisa los códigos e intenta de nuevo.', finalPass: '🎉 ¡Excelente! Relacionaste todos los códigos correctamente.', finalFail: '📋 Sigue practicando — revisa la tabla de códigos e intenta de nuevo.' },
  pt: { round: 'Rodada', of: 'de', dragDesc: 'Arraste cada descrição para o código de falha correto', check: 'Verificar Respostas', next: 'Próxima Rodada →', restart: 'Reiniciar Quiz', correct: 'Correto!', wrong: 'Errado', score: 'Pontuação', pass: 'Ótimo! Você passou nesta rodada.', fail: 'Revise os códigos e tente novamente.', finalPass: '🎉 Excelente! Você relacionou todos os códigos corretamente.', finalFail: '📋 Continue praticando — revise a tabela de códigos e tente novamente.' },
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function RoundQuiz({ items, lang, tx, onComplete, roundNum, totalRounds }) {
  const [shuffledDescs, setShuffledDescs] = useState(() => shuffle(items.map(i => i.code)))
  const [assignments, setAssignments] = useState({}) // { code: assignedCode }
  const [dragging, setDragging] = useState(null)
  const [checked, setChecked] = useState(false)
  const [results, setResults] = useState({})

  // Mobile: tap to select then tap target
  const [selected, setSelected] = useState(null)

  function handleDragStart(code) { setDragging(code) }

  function handleDrop(targetCode) {
    if (!dragging) return
    // Swap if already assigned
    const newAssignments = { ...assignments }
    const prev = Object.entries(newAssignments).find(([k, v]) => v === dragging)
    if (prev) delete newAssignments[prev[0]]
    newAssignments[targetCode] = dragging
    setAssignments(newAssignments)
    setDragging(null)
  }

  function handleTap(descCode) {
    if (checked) return
    if (!selected) { setSelected(descCode); return }
    // assign selected desc to tapped slot or swap
    const newAssignments = { ...assignments }
    // find if selected is already placed
    const prevSlot = Object.entries(newAssignments).find(([k, v]) => v === selected)
    if (prevSlot) delete newAssignments[prevSlot[0]]
    newAssignments[descCode] = selected
    setAssignments(newAssignments)
    setSelected(null)
  }

  function checkAnswers() {
    const res = {}
    items.forEach(item => { res[item.code] = assignments[item.code] === item.code })
    setResults(res)
    setChecked(true)
  }

  const allAssigned = items.every(item => assignments[item.code])
  const correctCount = checked ? Object.values(results).filter(Boolean).length : 0
  const passed = checked && correctCount === items.length

  // Unassigned descriptions
  const assigned = Object.values(assignments)
  const unassigned = shuffledDescs.filter(c => !assigned.includes(c))

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#0078C8] bg-[#E8F3FB] px-3 py-1 rounded">{tx.round} {roundNum} {tx.of} {totalRounds}</span>
        {checked && <span className={`text-sm font-semibold ${passed ? 'text-green-600' : 'text-red-500'}`}>{tx.score}: {correctCount}/{items.length}</span>}
      </div>

      <p className="text-gray-500 text-sm mb-5">{tx.dragDesc}</p>

      {/* Description pool */}
      <div className="flex flex-wrap gap-2 mb-6 min-h-[48px] bg-gray-50 rounded-xl p-3 border border-dashed border-gray-200">
        {unassigned.map(code => {
          const item = items.find(i => i.code === code)
          return (
            <div key={code}
              draggable={!checked}
              onDragStart={() => handleDragStart(code)}
              onClick={() => { if (!checked) setSelected(selected === code ? null : code) }}
              className={`px-3 py-2 rounded-lg text-xs font-medium cursor-grab border-2 transition max-w-xs leading-tight
                ${selected === code ? 'border-[#0078C8] bg-[#E8F3FB] text-[#003865]' : 'border-gray-200 bg-white text-gray-600 hover:border-[#0078C8]'}
                ${checked ? 'cursor-default' : ''}`}>
              {item[lang]}
            </div>
          )
        })}
        {unassigned.length === 0 && !checked && <span className="text-xs text-gray-400 self-center">All descriptions placed ✓</span>}
      </div>

      {/* Code slots */}
      <div className="space-y-3">
        {items.map(item => {
          const assignedCode = assignments[item.code]
          const assignedItem = assignedCode ? items.find(i => i.code === assignedCode) : null
          const isCorrect = checked ? results[item.code] : null

          return (
            <div key={item.code}
              onDragOver={e => { e.preventDefault() }}
              onDrop={() => handleDrop(item.code)}
              onClick={() => { if (!checked && selected) handleTap(item.code) }}
              className={`flex gap-3 items-start p-3 rounded-xl border-2 transition
                ${checked
                  ? isCorrect ? 'border-green-400 bg-green-50' : 'border-red-300 bg-red-50'
                  : assignedItem ? 'border-[#BDD9EF] bg-white' : 'border-dashed border-gray-200 bg-gray-50'}
              `}>
              <div className="font-mono font-bold text-[#003865] text-sm w-20 flex-shrink-0 mt-0.5">{item.code}</div>
              <div className="flex-1 min-h-[32px]">
                {assignedItem ? (
                  <div className={`text-xs leading-relaxed font-medium
                    ${checked ? isCorrect ? 'text-green-700' : 'text-red-600' : 'text-gray-700'}`}>
                    {assignedItem[lang]}
                    {checked && !isCorrect && (
                      <div className="mt-1 text-green-700 font-normal">✓ {items.find(i => i.code === item.code)[lang]}</div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-gray-300 italic">Drop here / Tap to place</div>
                )}
              </div>
              {checked && (
                <div className={`text-lg flex-shrink-0 ${isCorrect ? 'text-green-500' : 'text-red-400'}`}>
                  {isCorrect ? '✓' : '✗'}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Remove assignment on click when checked=false */}
      {!checked && Object.entries(assignments).length > 0 && (
        <p className="text-xs text-gray-400 mt-3">Click a placed description to move it back to the pool.</p>
      )}

      <div className="mt-6 flex gap-3 flex-wrap">
        {!checked ? (
          <button onClick={checkAnswers} disabled={!allAssigned}
            className="bg-[#003865] hover:bg-[#0078C8] text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition disabled:opacity-40 disabled:cursor-not-allowed">
            {tx.check}
          </button>
        ) : (
          <>
            <div className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold ${passed ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
              {passed ? tx.pass : tx.fail}
            </div>
            <button onClick={() => onComplete(correctCount, items.length)}
              className="bg-[#003865] hover:bg-[#0078C8] text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition">
              {tx.next}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default function FaultCodesDragQuiz({ lang, onScoreSave }) {
  const [round, setRound] = useState(1)
  const [scores, setScores] = useState([])
  const [done, setDone] = useState(false)
  const tx = txLabels[lang] || txLabels.en

  function handleRound1Complete(correct, total) {
    setScores([{ correct, total }])
    setRound(2)
  }

  function handleRound2Complete(correct, total) {
    const allScores = [...scores, { correct, total }]
    setScores(allScores)
    setDone(true)
    const totalCorrect = allScores.reduce((a, s) => a + s.correct, 0)
    const totalItems = allScores.reduce((a, s) => a + s.total, 0)
    const pct = Math.round((totalCorrect / totalItems) * 100)
    if (onScoreSave) onScoreSave(pct, pct >= 90)
  }

  function restart() { setRound(1); setScores([]); setDone(false) }

  const totalCorrect = scores.reduce((a, s) => a + s.correct, 0)
  const totalItems = scores.reduce((a, s) => a + s.total, 0)
  const finalPct = totalItems ? Math.round((totalCorrect / totalItems) * 100) : 0
  const finalPassed = finalPct >= 90

  if (done) return (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
      <div className="text-4xl mb-3">{finalPassed ? '🎉' : '📋'}</div>
      <div className={`text-5xl font-bold mb-3 ${finalPassed ? 'text-green-600' : 'text-red-500'}`}>{finalPct}%</div>
      <p className="text-gray-600 mb-6">{finalPassed ? tx.finalPass : tx.finalFail}</p>
      <button onClick={restart} className="bg-[#003865] hover:bg-[#0078C8] text-white font-semibold px-6 py-2.5 rounded-lg transition text-sm">{tx.restart}</button>
    </div>
  )

  return (
    <div>
      {round === 1 && <RoundQuiz items={round1} lang={lang} tx={tx} onComplete={handleRound1Complete} roundNum={1} totalRounds={2} />}
      {round === 2 && <RoundQuiz items={round2} lang={lang} tx={tx} onComplete={handleRound2Complete} roundNum={2} totalRounds={2} />}
    </div>
  )
}
