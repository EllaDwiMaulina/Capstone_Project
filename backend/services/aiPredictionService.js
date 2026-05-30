const HF_API_URL = process.env.HF_AI_API_URL || 'https://mandalale-citizen-care.hf.space';
const DEFAULT_DAMAGE_LEVEL = 'Sedang';
const REQUEST_TIMEOUT_MS = Number(process.env.HF_AI_TIMEOUT_MS) || 12000;

const damageLevelMap = {
  ringan: 'Ringan',
  sedang: 'Sedang',
  berat: 'Berat',
};

export function normalizeDamageLevel(value) {
  return damageLevelMap[String(value || '').toLowerCase()] || DEFAULT_DAMAGE_LEVEL;
}

export function getPriorityFromDamageLevel(kerusakan) {
  if (kerusakan === 'Berat') {
    return 'High';
  }

  if (kerusakan === 'Ringan') {
    return 'Low';
  }

  return 'Medium';
}

export async function predictDamageLevel(deskripsi) {
  if (!deskripsi?.trim()) {
    return {
      kerusakan: DEFAULT_DAMAGE_LEVEL,
      source: 'default',
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${HF_API_URL}/predict`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: deskripsi }),
      signal: controller.signal,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.detail || result?.message || 'Gagal memproses prediksi AI.');
    }

    return {
      kerusakan: normalizeDamageLevel(result.tingkat_kerusakan),
      source: 'huggingface',
      severityScore: result.severity_score,
      confidence: result.confidence,
      probabilities: result.probabilities,
    };
  } catch (error) {
    console.warn(`Prediksi AI gagal, memakai default ${DEFAULT_DAMAGE_LEVEL}:`, error.message);

    return {
      kerusakan: DEFAULT_DAMAGE_LEVEL,
      source: 'default',
    };
  } finally {
    clearTimeout(timeout);
  }
}
