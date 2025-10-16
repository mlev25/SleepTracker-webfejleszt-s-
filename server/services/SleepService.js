// Alvási fázisok hozzávetőleges eloszlása százalékban
const BASE_PHASE_DISTRIBUTION = {
    LIGHT: 0.55, 
    DEEP: 0.20,  
    REM: 0.20,   
    WAKE: 0.05   
};

/**
 * Generálja a becsült alvási fázisokat és azok időtartamát.
 * @param {number} totalMinutes - Az alvás teljes időtartama percekben.
 * @param {number} quality - A felhasználó által megadott alvásminőség (1-5).
 * @param {boolean} wasInterrupted - Volt-e ébredés.
 * @returns {Array} - A becsült SleepEvent objektumok tömbje.
 */
const generateSleepEvents = (totalMinutes, quality, wasInterrupted) => {
    let distribution = { ...BASE_PHASE_DISTRIBUTION };
    const events = [];

    // --- Módosítás a Minőség és Megszakítás alapján ---
    if (quality <= 2) {
        distribution.DEEP = Math.max(0.10, distribution.DEEP - 0.05);
        distribution.REM = Math.max(0.15, distribution.REM - 0.05);
        distribution.LIGHT += 0.10; 
    } else if (quality >= 4) {
        distribution.DEEP = Math.min(0.25, distribution.DEEP + 0.05);
        distribution.REM = Math.min(0.25, distribution.REM + 0.05);
        distribution.LIGHT -= 0.10; 
    }
    
    if (wasInterrupted) {
        distribution.WAKE = Math.min(0.10, distribution.WAKE + 0.05); 
    }

    // Normalizálás a 100% biztosításához
    const totalDist = Object.values(distribution).reduce((sum, val) => sum + val, 0);
    for (const key in distribution) {
        distribution[key] /= totalDist;
    }

    // --- Fázisok Generálása (Szimuláció) ---
    let timeElapsed = 0;
    const PHASE_ORDER = ['LIGHT', 'DEEP', 'REM', 'LIGHT', 'WAKE']; 
    
    // Generálunk egy ciklust
    for (const phase of PHASE_ORDER) {
        if (distribution[phase] <= 0.01) continue; // Kihagyjuk, ha elhanyagolható

        const duration = Math.round(totalMinutes * distribution[phase]);
        
        if (duration > 0) {
            // A startTime hozzávetőleges becslése
            const startTime = new Date(Date.now() - (totalMinutes - timeElapsed) * 60 * 1000); 
            
            events.push({
                eventType: phase,
                durationMinutes: duration,
                startTime: startTime
            });
            timeElapsed += duration;
        }
    }

    return events;
};

module.exports = { generateSleepEvents };