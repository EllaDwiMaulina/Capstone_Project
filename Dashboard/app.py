import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import seaborn as sns
import numpy as np
import os

# ── Page Config ──────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="Infrastruktur DKI Jakarta | Analytics",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── Custom CSS ────────────────────────────────────────────────────────────────
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

html, body, [class*="css"] {
    font-family: 'Inter', sans-serif;
}

.stApp {
    background: #0E1117;
    color: #E2E8F0;
}

[data-testid="stSidebar"] {
    background: #151923 !important;
    border-right: 1px solid #2D3748;
}
[data-testid="stSidebar"] .stMarkdown h2 {
    color: #A0AEC0;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
}

[data-testid="metric-container"] {
    background: #151923;
    border: 1px solid #2D3748;
    border-radius: 8px;
    padding: 1.25rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
}
[data-testid="metric-container"] label {
    color: #A0AEC0 !important;
    font-size: 0.75rem !important;
    font-weight: 500 !important;
}
[data-testid="metric-container"] [data-testid="stMetricValue"] {
    color: #FFFFFF !important;
    font-size: 1.75rem !important;
    font-weight: 700 !important;
}
[data-testid="metric-container"] [data-testid="stMetricDelta"] {
    font-size: 0.75rem !important;
}

.section-title {
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #CBD5E0;
    margin: 2rem 0 1rem 0;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #2D3748;
}

.hero {
    background: #151923;
    border: 1px solid #2D3748;
    border-left: 4px solid #3182CE;
    border-radius: 8px;
    padding: 1.5rem 2rem;
    margin-bottom: 2rem;
}
.hero h1 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #FFFFFF;
    margin: 0 0 0.5rem 0;
}
.hero p {
    color: #A0AEC0;
    font-size: 0.9rem;
    margin: 0;
}

[data-testid="stTabs"] button {
    color: #A0AEC0;
    font-weight: 500;
    font-size: 0.85rem;
}
[data-testid="stTabs"] button[aria-selected="true"] {
    color: #FFFFFF !important;
    border-bottom-color: #3182CE !important;
}

hr {
    border-color: #2D3748;
}
</style>
""", unsafe_allow_html=True)

# ── Matplotlib Dark Theme ─────────────────────────────────────────────────────
plt.rcParams.update({
    'figure.facecolor':  '#0E1117',
    'axes.facecolor':    '#0E1117',
    'axes.edgecolor':    '#2D3748',
    'axes.labelcolor':   '#A0AEC0',
    'axes.titlecolor':   '#E2E8F0',
    'xtick.color':       '#A0AEC0',
    'ytick.color':       '#A0AEC0',
    'grid.color':        '#2D3748',
    'grid.linewidth':    0.5,
    'text.color':        '#E2E8F0',
    'font.family':       'sans-serif',
    'axes.spines.top':   False,
    'axes.spines.right': False,
})

BLUE_MAIN = '#3182CE'
RED_ACC   = '#E53E3E'
GRAY_ACC  = '#718096'
PALETTE   = ['#2B6CB0', '#3182CE', '#4299E1', '#63B3ED', '#90CDF4']

# ── Load Data ─────────────────────────────────────────────────────────────────
@st.cache_data
def load_data():
    # Cari file CSV di beberapa lokasi umum
    candidates = [
        'Data_Laporan_Infrastruktur_Clean_Fix.csv'
    ]
    df = None
    for path in candidates:
        if os.path.exists(path):
            df = pd.read_csv(path)
            break

    if df is None:
        st.error("File CSV tidak ditemukan. Letakkan 'Data_Laporan_Infrastruktur_Clean_Fix.csv' di direktori yang sama dengan app.py.")
        st.stop()

    # Parse tanggal
    df['date_laporan'] = pd.to_datetime(df['date_laporan'])

    # ── Normalisasi nilai ke Title Case ─────────────────────────────────────
    # Data baru menggunakan lowercase; kita seragamkan agar filter & label konsisten
    df['kota_administrasi']  = df['kota_administrasi'].str.title()
    df['jenis_infrastruktur'] = df['jenis_infrastruktur'].str.title()
    df['tingkat_kerusakan']  = df['tingkat_kerusakan'].str.title()

    # ── Rekayasa fitur ────────────────────────────────────────────────────────
    if 'bulan' not in df.columns:
        df['bulan'] = df['date_laporan'].dt.month
    if 'semester' not in df.columns:
        df['semester'] = df['bulan'].apply(lambda m: 1 if m <= 6 else 2)
    if 'is_weekend' not in df.columns:
        df['is_weekend'] = df['date_laporan'].dt.dayofweek.apply(
            lambda x: 1 if x >= 5 else 0)

    return df


df_raw = load_data()

# ── Sidebar ───────────────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("## Parameter Analisis")

    kota_options = sorted(df_raw['kota_administrasi'].unique().tolist())
    kota_sel = st.multiselect(
        "Kota Administrasi", options=kota_options, default=kota_options)

    infra_options = sorted(df_raw['jenis_infrastruktur'].unique().tolist())
    infra_sel = st.multiselect(
        "Jenis Infrastruktur", options=infra_options, default=infra_options)

    # Nilai kerusakan sudah di-title-case saat load; gunakan yang ada di data
    kerusakan_options = sorted(df_raw['tingkat_kerusakan'].unique().tolist())
    kerusakan_sel = st.multiselect(
        "Tingkat Kerusakan", options=kerusakan_options, default=kerusakan_options)

    bulan_range = st.slider(
        "Rentang Bulan", min_value=1, max_value=12, value=(1, 12), format="Bulan %d")

    st.markdown("---")
    st.markdown("## Filter Waktu")
    sem_sel = st.radio("Periode Semester", options=[
        "Keseluruhan", "Semester 1 (Jan-Jun)", "Semester 2 (Jul-Des)"], index=0)

    st.markdown("---")
    st.caption("DBS Coding Camp - Cizencare Dashboard Analytics")

# ── Apply Filters ─────────────────────────────────────────────────────────────
df = df_raw[
    df_raw['kota_administrasi'].isin(kota_sel) &
    df_raw['jenis_infrastruktur'].isin(infra_sel) &
    df_raw['tingkat_kerusakan'].isin(kerusakan_sel) &
    df_raw['bulan'].between(bulan_range[0], bulan_range[1])
].copy()

if sem_sel == "Semester 1 (Jan-Jun)":
    df = df[df['semester'] == 1]
elif sem_sel == "Semester 2 (Jul-Des)":
    df = df[df['semester'] == 2]

# ── Hero Header ───────────────────────────────────────────────────────────────
st.markdown("""
<div class="hero">
    <h1>Dashboard Infrastruktur DKI Jakarta 2025</h1>
    <p>Sistem pemantauan dan analisis distribusi pelaporan kerusakan infrastruktur publik di wilayah administratif Jakarta.</p>
</div>
""", unsafe_allow_html=True)

# ── Metric Cards ──────────────────────────────────────────────────────────────
total     = len(df)
total_raw = len(df_raw)
pct       = (total / total_raw * 100) if total_raw else 0
berat_cnt = len(df[df['tingkat_kerusakan'] == 'Berat'])
berat_pct = (berat_cnt / total * 100) if total else 0
avg_month = round(total / df['bulan'].nunique(), 0) if df['bulan'].nunique() > 0 else 0
top_kota  = df['kota_administrasi'].value_counts().idxmax() if total > 0 else "-"
top_infra = df['jenis_infrastruktur'].value_counts().idxmax() if total > 0 else "-"

c1, c2, c3, c4, c5 = st.columns(5)
c1.metric("Total Laporan",         f"{total:,}",          f"{pct:.1f}% dari dataset")
c2.metric("Kerusakan Berat",       f"{berat_cnt:,}",      f"{berat_pct:.1f}% dari total")
c3.metric("Rata-rata Bulanan",     f"{avg_month:,.0f}",   "Laporan")
c4.metric("Wilayah Tertinggi",     top_kota)
c5.metric("Infrastruktur Mayoritas", top_infra)

st.markdown("<div style='height:1.5rem'></div>", unsafe_allow_html=True)

# ── Tabs ──────────────────────────────────────────────────────────────────────
tab1, tab2, tab3, tab4 = st.tabs([
    "Distribusi Wilayah",
    "Tren Waktu",
    "Kategori Kerusakan",
    "Analisis Komprehensif"
])

# ═══════════════════════════════════════════════════════════
# TAB 1 — Distribusi Wilayah
# ═══════════════════════════════════════════════════════════
with tab1:
    st.markdown('<div class="section-title">Volume Laporan per Wilayah Administrasi</div>',
                unsafe_allow_html=True)

    kota_df = df.groupby('kota_administrasi').size().reset_index(name='jumlah_laporan')
    kota_df['persentase'] = (kota_df['jumlah_laporan'] / kota_df['jumlah_laporan'].sum() * 100).round(2)
    kota_df = kota_df.sort_values('jumlah_laporan', ascending=False)

    col_bar, col_pie = st.columns([3, 2])

    with col_bar:
        fig, ax = plt.subplots(figsize=(9, 5))
        colors_bar = [BLUE_MAIN if i == 0 else '#2D3748' for i in range(len(kota_df))]
        bars = ax.bar(kota_df['kota_administrasi'], kota_df['jumlah_laporan'],
                      color=colors_bar, width=0.5)

        for bar, (_, row) in zip(bars, kota_df.iterrows()):
            ax.text(bar.get_x() + bar.get_width()/2,
                    bar.get_height() + (kota_df['jumlah_laporan'].max() * 0.02),
                    f"{row['jumlah_laporan']:,}",
                    ha='center', va='bottom', fontsize=9, color='#E2E8F0')

        ax.set_title('Distribusi Volume Laporan', fontsize=11, fontweight='600', pad=15)
        ax.set_ylabel('Jumlah Laporan', fontsize=9)
        ax.set_ylim(0, kota_df['jumlah_laporan'].max() * 1.15)
        ax.yaxis.set_major_formatter(mticker.FuncFormatter(lambda x, _: f'{int(x):,}'))
        plt.xticks(rotation=15, ha='right', fontsize=8)
        plt.tight_layout()
        st.pyplot(fig)
        plt.close()

    with col_pie:
        fig2, ax2 = plt.subplots(figsize=(5, 5))
        wedges, texts, autotexts = ax2.pie(
            kota_df['jumlah_laporan'],
            labels=kota_df['kota_administrasi'],
            autopct='%1.1f%%',
            colors=PALETTE,
            startangle=90,
            wedgeprops=dict(edgecolor='#0E1117', linewidth=1.5)
        )
        for t in texts:
            t.set_fontsize(7)
            t.set_color('#A0AEC0')
        for at in autotexts:
            at.set_fontsize(7)
            at.set_color('#FFFFFF')
            at.set_fontweight('600')
        ax2.set_title('Proporsi Wilayah', fontsize=11, fontweight='600', pad=15)
        plt.tight_layout()
        st.pyplot(fig2)
        plt.close()

    with st.expander("Tampilkan Data Tabular"):
        st.dataframe(kota_df.rename(columns={
            'kota_administrasi': 'Wilayah',
            'jumlah_laporan':    'Total Laporan',
            'persentase':        'Persentase (%)'
        }), use_container_width=True, hide_index=True)

# ═══════════════════════════════════════════════════════════
# TAB 2 — Tren Waktu
# ═══════════════════════════════════════════════════════════
with tab2:
    st.markdown('<div class="section-title">Dinamika Pelaporan Bulanan</div>',
                unsafe_allow_html=True)

    MONTH_LABEL = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']
    monthly_df = (df['date_laporan'].dt.month.value_counts().sort_index().reset_index())
    monthly_df.columns = ['bulan', 'jumlah_laporan']

    full_months = pd.DataFrame({'bulan': range(1, 13)})
    monthly_df  = full_months.merge(monthly_df, on='bulan', how='left').fillna(0)
    monthly_df['jumlah_laporan'] = monthly_df['jumlah_laporan'].astype(int)
    rata_rata = monthly_df['jumlah_laporan'].mean()

    fig, ax = plt.subplots(figsize=(12, 4.5))
    ax.plot(range(12), monthly_df['jumlah_laporan'],
            marker='o', color=BLUE_MAIN, linewidth=2, markersize=6)
    ax.fill_between(range(12), monthly_df['jumlah_laporan'], alpha=0.1, color=BLUE_MAIN)
    ax.axhline(rata_rata, color=GRAY_ACC, linestyle='--', linewidth=1,
               label=f'Rata-rata ({rata_rata:.0f})')
    ax.axvline(5.5, color='#2D3748', linestyle=':', linewidth=1.5)

    for i, val in enumerate(monthly_df['jumlah_laporan']):
        if val > 0:
            ax.text(i, val + (monthly_df['jumlah_laporan'].max() * 0.05),
                    str(val), ha='center', fontsize=8, color='#E2E8F0')

    ax.set_xticks(range(12))
    ax.set_xticklabels(MONTH_LABEL, fontsize=9)
    ax.set_ylabel('Volume Laporan', fontsize=9)
    ax.set_ylim(0, monthly_df['jumlah_laporan'].max() * 1.2)
    ax.legend(fontsize=9, loc='upper right')
    plt.tight_layout()
    st.pyplot(fig)
    plt.close()

    col_s1, col_s2, col_diff = st.columns(3)
    s1_total = len(df[df['semester'] == 1])
    s2_total = len(df[df['semester'] == 2])
    diff = s2_total - s1_total
    col_s1.metric("Total Semester 1", f"{s1_total:,}")
    col_s2.metric("Total Semester 2", f"{s2_total:,}")
    col_diff.metric("Deviasi S2 vs S1", f"{diff:,}", f"{(diff)/max(s1_total,1)*100:.1f}%")

# ═══════════════════════════════════════════════════════════
# TAB 3 — Kategori Kerusakan
# ═══════════════════════════════════════════════════════════
with tab3:
    st.markdown('<div class="section-title">Fokus Infrastruktur Berisiko Tinggi</div>',
                unsafe_allow_html=True)

    col_left, col_right = st.columns(2)

    with col_left:
        st.markdown("<p style='font-size: 0.9rem; font-weight: 500;'>Kerusakan Berat (Semester 1)</p>",
                    unsafe_allow_html=True)
        df_s1_berat = df[(df['bulan'] <= 6) & (df['tingkat_kerusakan'] == 'Berat')]
        q3_df = df_s1_berat.groupby('jenis_infrastruktur').size().reset_index(name='jumlah')
        q3_df = q3_df.sort_values('jumlah', ascending=True)

        if len(q3_df) == 0:
            st.info("Data tidak tersedia untuk parameter yang dipilih.")
        else:
            fig, ax = plt.subplots(figsize=(6, 4))
            colors_q3 = [RED_ACC if v == q3_df['jumlah'].max() else '#2D3748'
                         for v in q3_df['jumlah']]
            bars = ax.barh(q3_df['jenis_infrastruktur'], q3_df['jumlah'],
                           color=colors_q3, height=0.5)
            for bar, val in zip(bars, q3_df['jumlah']):
                ax.text(bar.get_width() + (q3_df['jumlah'].max() * 0.02),
                        bar.get_y() + bar.get_height()/2,
                        str(val), va='center', fontsize=9, color='#E2E8F0')
            ax.set_xlabel('Volume Laporan', fontsize=9)
            ax.set_xlim(0, q3_df['jumlah'].max() * 1.15)
            plt.tight_layout()
            st.pyplot(fig)
            plt.close()

    with col_right:
        # ── Perbaikan: gunakan casing yang sudah dinormalisasi ───────────────
        target_infra = 'Trotoar'
        target_kota  = 'Jakarta Selatan'
        st.markdown(
            f"<p style='font-size: 0.9rem; font-weight: 500;'>{target_infra} Rusak Berat ({target_kota})</p>",
            unsafe_allow_html=True)
        df_q4 = df[
            (df['jenis_infrastruktur'] == target_infra) &
            (df['kota_administrasi']   == target_kota)  &
            (df['tingkat_kerusakan']   == 'Berat')
        ]
        s1 = df_q4[df_q4['semester'] == 1].shape[0]
        s2 = df_q4[df_q4['semester'] == 2].shape[0]

        fig, ax = plt.subplots(figsize=(6, 4))
        bars = ax.bar(['Semester 1', 'Semester 2'], [s1, s2],
                      color=[GRAY_ACC, RED_ACC], width=0.4)
        for bar, val in zip(bars, [s1, s2]):
            ax.text(bar.get_x() + bar.get_width()/2,
                    bar.get_height() + (max(s1, s2, 1) * 0.02),
                    str(val), ha='center', fontsize=10, fontweight='600', color='#E2E8F0')
        ax.set_ylabel('Volume Laporan', fontsize=9)
        ax.set_ylim(0, max(s1, s2, 1) * 1.2)
        plt.tight_layout()
        st.pyplot(fig)
        plt.close()

    st.markdown('<div class="section-title">Matriks Distribusi: Wilayah vs Infrastruktur</div>',
                unsafe_allow_html=True)
    pivot = df.groupby(['kota_administrasi', 'jenis_infrastruktur']).size().unstack(fill_value=0)
    if not pivot.empty:
        fig, ax = plt.subplots(figsize=(12, 4))
        sns.heatmap(pivot, annot=True, fmt='d', cmap='Blues_r',
                    linewidths=1, linecolor='#0E1117', ax=ax, cbar=False)
        ax.set_xlabel('')
        ax.set_ylabel('')
        plt.xticks(rotation=15, ha='right', fontsize=9)
        plt.yticks(fontsize=9)
        plt.tight_layout()
        st.pyplot(fig)
        plt.close()

# ═══════════════════════════════════════════════════════════
# TAB 4 — Analisis Komprehensif
# ═══════════════════════════════════════════════════════════
with tab4:
    st.markdown('<div class="section-title">Evaluasi Mendalam</div>',
                unsafe_allow_html=True)

    col_a, col_b = st.columns(2)

    with col_a:
        st.markdown("<p style='font-size: 0.9rem; font-weight: 500;'>Komposisi Tingkat Kerusakan (Per Wilayah)</p>",
                    unsafe_allow_html=True)
        pivot_k = df.groupby(['kota_administrasi', 'tingkat_kerusakan']).size().unstack(fill_value=0)
        for col in ['Ringan', 'Sedang', 'Berat']:
            if col not in pivot_k.columns:
                pivot_k[col] = 0
        pivot_k = pivot_k[['Ringan', 'Sedang', 'Berat']]

        fig, ax = plt.subplots(figsize=(7, 4.5))
        pivot_k.plot(kind='bar', stacked=True,
                     color=['#4299E1', '#D69E2E', RED_ACC], ax=ax, width=0.5)
        ax.set_xlabel('')
        ax.set_ylabel('Volume', fontsize=9)
        ax.legend(title='', fontsize=8, frameon=False)
        plt.xticks(rotation=15, ha='right', fontsize=8)
        plt.tight_layout()
        st.pyplot(fig)
        plt.close()

    with col_b:
        st.markdown("<p style='font-size: 0.9rem; font-weight: 500;'>Proporsi Pelaporan Berdasarkan Hari</p>",
                    unsafe_allow_html=True)
        wk_df = df.groupby('is_weekend').size().reset_index(name='jumlah')
        wk_df['label'] = wk_df['is_weekend'].map({0: 'Hari Kerja', 1: 'Akhir Pekan'})

        fig, ax = plt.subplots(figsize=(5, 4.5))
        ax.pie(wk_df['jumlah'], labels=wk_df['label'], autopct='%1.1f%%',
               colors=[BLUE_MAIN, GRAY_ACC], startangle=90,
               wedgeprops=dict(edgecolor='#0E1117', linewidth=1.5),
               textprops={'color': '#E2E8F0', 'fontsize': 9})
        plt.tight_layout()
        st.pyplot(fig)
        plt.close()

    st.markdown('<div class="section-title">Raw Data Eksplorasi</div>',
                unsafe_allow_html=True)
    st.dataframe(df.head(100), use_container_width=True, hide_index=True)
    st.caption(f"Menampilkan 100 observasi teratas dari total {len(df):,} baris.")