interface HeaderProps {
  unit: 'C' | 'F';
  setUnit: (unit: 'C' | 'F') => void;
}

function Header({ unit, setUnit }: HeaderProps) {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-2">
      <div className="flex items-center gap-5">
        <div className="text-4xl bg-[#0c1524] border border-[#192638] rounded-2xl p-3.5 shadow-md text-blue-400 backdrop-blur-sm">
          🌦️
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Weather Dashboard
          </h1>
          <h3 className="text-sm md:text-base text-[#6f849c] font-normal mt-1">
            Real-time weather updates every 15 seconds.
          </h3>
        </div>
      </div>

      <div className="flex items-center gap-4 self-end md:self-auto">
        {/* Toggle C° / F° */}
        <div className="flex items-center bg-[#0c1524] border border-[#192638] rounded-full p-1 shadow-inner">
          <button
            onClick={() => setUnit('C')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              unit === 'C' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            °C
          </button>
          <button
            onClick={() => setUnit('F')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              unit === 'F' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            °F
          </button>
        </div>

        {/* Live Badge */}
        <div className="flex items-center gap-2.5 bg-[#0c1524] border border-[#192638] rounded-full px-4 py-2 text-white font-semibold text-sm shadow-sm">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
          Live
        </div>
      </div>
    </header>
  )
}

export default Header