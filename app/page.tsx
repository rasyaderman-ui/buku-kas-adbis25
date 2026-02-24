"use client";

import { useEffect, useState } from "react";
import { mahasiswa } from "@/data/mahasiswa";

const bulanList = [
  "Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember"
];

export default function Home() {
  const [kasAktif, setKasAktif] = useState(true);
  const [bulanAktif, setBulanAktif] = useState("Januari");
  const [dataBayar, setDataBayar] = useState<{[key:string]: string[]}>({});
  const [totalKas, setTotalKas] = useState(0);

  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");

  const [pengeluaran, setPengeluaran] = useState<any[]>([]);
const [totalPengeluaran, setTotalPengeluaran] = useState(0);
const [jumlahKeluar, setJumlahKeluar] = useState("");
const [keterangan, setKeterangan] = useState("");

  useEffect(() => {
    fetch("/api/kas")
      .then(res => res.json())
      .then(data => {
        setDataBayar(data);

        let total = 0;
        Object.values(data).forEach((bulanArr: any) => {
          total += bulanArr.length * 10000;
        });
        setTotalKas(total);
      });
  }, []);
  fetch("/api/pengeluaran")
  .then(res => res.json())
  .then(data => {
    setPengeluaran(data);
    const total = data.reduce((sum: number, item: any) => sum + item.jumlah, 0);
    setTotalPengeluaran(total);
  });

  const login = () => {
    if (password === "bendahara145") {
      setIsAdmin(true);
    } else {
      alert("Password salah");
    }
  };

  const bayar = async (nama: string) => {
    if (!isAdmin) return;

    const sudahBayar = dataBayar[nama] || [];

    if (sudahBayar.includes(bulanAktif)) {
      alert("Sudah bayar bulan ini!");
      return;
    }

    await fetch("/api/kas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama, bulan: bulanAktif })
    });

    const updated = {
      ...dataBayar,
      [nama]: [...sudahBayar, bulanAktif]
    };

    setDataBayar(updated);
    setTotalKas(totalKas + 10000);
  };

const tambahPengeluaran = async () => {
  if (!isAdmin) return;
  if (!jumlahKeluar) return;

  await fetch("/api/pengeluaran", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jumlah: parseInt(jumlahKeluar),
      keterangan
    })
  });

  setJumlahKeluar("");
  setKeterangan("");
  location.reload();
};

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">Buku Kas Adbis 25</h1>

      <p>Total Pemasukan: Rp {totalKas}</p>
<p>Total Pengeluaran: Rp {totalPengeluaran}</p>
<p><b>Sisa Kas: Rp {totalKas - totalPengeluaran}</b></p>

      {!isAdmin && (
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password Bendahara"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 mr-2"
          />
          <button
            onClick={login}
            className="bg-black text-white px-3 py-2 rounded"
          >
            Login
          </button>
        </div>
      )}

      <div className="mb-4">
        <label className="mr-2">Pilih Bulan:</label>
        <select
          value={bulanAktif}
          onChange={(e) => setBulanAktif(e.target.value)}
          className="border p-1"
        >
          {bulanList.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </div>

      {isAdmin && (
  <button
    onClick={() => setKasAktif(!kasAktif)}
    
    className="bg-red-500 text-white px-4 py-2 rounded mb-6"
  >
    {kasAktif ? "Stop Kas" : "Aktifkan Kas"}
  </button>
)}
{isAdmin && (
  <div className="border p-3 mt-4">
    <h3 className="font-bold mb-2">Tambah Pengeluaran</h3>

    <input
      type="number"
      placeholder="Jumlah"
      value={jumlahKeluar}
      onChange={(e) => setJumlahKeluar(e.target.value)}
      className="border p-1 mr-2 text-black"
    />

    <input
      type="text"
      placeholder="Keterangan"
      value={keterangan}
      onChange={(e) => setKeterangan(e.target.value)}
      className="border p-1 mr-2 text-black"
    />

    <button
      onClick={tambahPengeluaran}
      className="bg-red-600 text-white px-3 py-1 rounded"
    >
      Simpan Pengeluaran
    </button>
  </div>
)}

      <button
        onClick={() => window.open("/api/export")}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6 ml-3"
      >
        Export ke Excel
      </button>

      <div className="grid grid-cols-1 gap-2">
        {mahasiswa.map((nama, index) => {
          const sudahBayar = dataBayar[nama]?.includes(bulanAktif);

          return (
            <div
              key={index}
              className="border p-2 flex justify-between items-center"
            >
              <span>
                {nama} {sudahBayar && "✅"}
              </span>

              {isAdmin && kasAktif && !sudahBayar && (
                <button
                  onClick={() => bayar(nama)}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  Bayar
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
