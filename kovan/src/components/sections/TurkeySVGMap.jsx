import React from 'react';

const TurkeySVGMap = ({ provinces = [] }) => {
  const [selectedProvince, setSelectedProvince] = React.useState(null);
  const svgRef = React.useRef(null);

  // Get color based on index value
  const getProvinceColor = (index) => {
    if (index >= 80) return '#10B981'; // Dark Green
    if (index >= 60) return '#34D399'; // Light Green
    if (index >= 40) return '#FCD34D'; // Yellow
    if (index >= 20) return '#FB923C'; // Orange
    return '#EF4444'; // Red
  };

  // Load SVG and apply colors
  React.useEffect(() => {
    console.log('🗺️ TurkeySVGMap useEffect triggered');
    console.log('svgRef.current:', svgRef.current);
    console.log('provinces:', provinces);
    console.log('provinces.length:', provinces?.length);
    
    if (!svgRef.current) {
      console.warn('⚠️ svgRef.current is null');
      return;
    }
    
    if (!provinces || provinces.length === 0) {
      console.warn('⚠️ No provinces data provided');
      return;
    }

    console.log(`✅ Loading map with ${provinces.length} provinces`);

    // Create province data map
    const dataMap = {};
    provinces.forEach(p => {
      const code = String(p.plateCode).padStart(2, '0');
      dataMap[`TR-${code}`] = p;
    });
    
    console.log('📊 DataMap created:', Object.keys(dataMap).length, 'entries');
    console.log('First 3 entries:', Object.keys(dataMap).slice(0, 3));

    console.log('🌐 Fetching /harita-turkey.html...');
    fetch('/harita-turkey.html')
      .then(res => {
        console.log('✅ Fetch response:', res.status, res.statusText);
        return res.text();
      })
      .then(html => {
        console.log('📄 HTML loaded, length:', html.length);
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const paths = doc.querySelectorAll('svg path');
        console.log('🎨 Found', paths.length, 'path elements');
        
        const svgGroup = svgRef.current.querySelector('g');
        console.log('📦 SVG group element:', svgGroup);
        
        if (svgGroup && paths.length > 0) {
          svgGroup.innerHTML = '';
          
          let colored = 0;
          paths.forEach(path => {
            const cloned = path.cloneNode(true);
            const id = cloned.getAttribute('id');
            
            if (id && dataMap[id]) {
              const color = getProvinceColor(dataMap[id].index);
              cloned.setAttribute('fill', color);
              cloned.style.fillOpacity = '1';
              colored++;
            } else {
              cloned.setAttribute('fill', '#E5E7EB');
            }
            
            svgGroup.appendChild(cloned);
          });

          console.log(`✅ ✓ Loaded ${paths.length} provinces, colored ${colored}`);
        } else {
          console.error('❌ svgGroup or paths not found!');
        }
      })
      .catch(err => {
        console.error('❌ Map load error:', err);
        console.error('Error details:', err.message, err.stack);
      });
  }, [provinces]);

  // Handle mouse events
  React.useEffect(() => {
    if (!svgRef.current) return;

    const handleMouseMove = (e) => {
      if (e.target.tagName === 'path') {
        const id = e.target.getAttribute('id');
        if (id && id.startsWith('TR-')) {
          const code = String(parseInt(id.split('-')[1])).padStart(2, '0');
          const key = `TR-${code}`;
          
          const province = provinces.find(p => 
            `TR-${String(p.plateCode).padStart(2, '0')}` === key
          );
          
          if (province) {
            setSelectedProvince({
              ...province,
              x: e.clientX,
              y: e.clientY
            });
          }
        }
      } else {
        setSelectedProvince(null);
      }
    };

    const handleMouseLeave = () => {
      setSelectedProvince(null);
    };

    const svg = svgRef.current;
    svg.addEventListener('mousemove', handleMouseMove);
    svg.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      svg.removeEventListener('mousemove', handleMouseMove);
      svg.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [provinces]);

  const totals = React.useMemo(() => {
    if (!provinces || provinces.length === 0) {
      return { volunteers: 0, projects: 0, hours: 0 };
    }
    return provinces.reduce(
      (acc, p) => ({
        volunteers: acc.volunteers + (p.volunteers || 0),
        projects: acc.projects + (p.projects || 0),
        hours: acc.hours + (p.totalHours || 0),
      }),
      { volunteers: 0, projects: 0, hours: 0 }
    );
  }, [provinces]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Türkiye Gönüllülük Haritası
        </h1>
        <p className="text-gray-600">
          İllere göre gönüllülük endeksi ve istatistikler
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="text-sm font-medium opacity-90">Toplam Gönüllü</div>
          <div className="text-3xl font-bold mt-2">
            {totals.volunteers.toLocaleString('tr-TR')}
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="text-sm font-medium opacity-90">Toplam Proje</div>
          <div className="text-3xl font-bold mt-2">
            {totals.projects.toLocaleString('tr-TR')}
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="text-sm font-medium opacity-90">Toplam Saat</div>
          <div className="text-3xl font-bold mt-2">
            {totals.hours.toLocaleString('tr-TR')}
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="relative bg-white rounded-xl shadow-lg p-6">
        {/* Tooltip */}
        {selectedProvince && (
          <div
            className="fixed z-50 bg-orange-500 text-white px-6 py-4 rounded-lg shadow-xl pointer-events-none"
            style={{
              left: `${selectedProvince.x + 20}px`,
              top: `${selectedProvince.y + 20}px`,
            }}
          >
            <div className="font-bold text-lg mb-2">{selectedProvince.province}</div>
            <div className="space-y-1 text-sm">
              <div>Endeks: {selectedProvince.index}</div>
              <div>Gönüllü: {selectedProvince.volunteers.toLocaleString('tr-TR')}</div>
              <div>Proje: {selectedProvince.projects.toLocaleString('tr-TR')}</div>
              <div>Saat: {selectedProvince.totalHours.toLocaleString('tr-TR')}</div>
            </div>
          </div>
        )}

        {/* SVG */}
        <svg 
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 800 350" 
          className="w-full h-auto"
        >
          <defs>
            <filter id="hover-brightness">
              <feComponentTransfer>
                <feFuncR type="linear" slope="1.2"/>
                <feFuncG type="linear" slope="1.2"/>
                <feFuncB type="linear" slope="1.2"/>
              </feComponentTransfer>
            </filter>
          </defs>
          <style>{`
            path {
              stroke: white;
              stroke-width: 0.5;
              transition: all 0.3s ease;
              cursor: pointer;
            }
            path:hover {
              stroke-width: 2;
              filter: url(#hover-brightness);
            }
          `}</style>
          <g></g>
        </svg>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <div className="text-sm font-medium text-gray-700">Gönüllülük Endeksi:</div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-4 rounded" style={{ backgroundColor: '#EF4444' }}></div>
            <span className="text-xs text-gray-600">0-20</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-4 rounded" style={{ backgroundColor: '#FB923C' }}></div>
            <span className="text-xs text-gray-600">20-40</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-4 rounded" style={{ backgroundColor: '#FCD34D' }}></div>
            <span className="text-xs text-gray-600">40-60</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-4 rounded" style={{ backgroundColor: '#34D399' }}></div>
            <span className="text-xs text-gray-600">60-80</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-4 rounded" style={{ backgroundColor: '#10B981' }}></div>
            <span className="text-xs text-gray-600">80-100</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TurkeySVGMap;
