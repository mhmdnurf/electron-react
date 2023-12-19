import React, { useState, useEffect } from "react";
import BackButton from "../components/BackButton";

interface Anggaran {
  id?: number;
  kategori: string;
  nama_item: string;
  harga?: number;
  total_harga?: number;
  waktu?: number;
  keterangan: string;
}

const FormAnggaran = (): React.JSX.Element => {
  const [formData, setFormData] = useState<Anggaran>({
    kategori: "Biaya Tenaga Ahli",
    nama_item: "",
    harga: undefined,
    waktu: undefined,
    total_harga: undefined,
    keterangan: "",
  });
  const [dataAnggaran, setDataAnggaran] = useState<Anggaran[]>([]);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch("http://localhost:3001/api/anggaran")
      .then((response) => response.json())
      .then((data) => setDataAnggaran(Array.isArray(data) ? data : []))
      .catch((error) => console.error("Error fetching data:", error));
  };

  const totalHargaByCategory = dataAnggaran.reduce((acc, anggaran) => {
    const kategori = anggaran.kategori;
    const totalHarga = anggaran.total_harga || 0;

    acc[kategori] = (acc[kategori] || 0) + totalHarga;
    return acc;
  }, {} as Record<string, number>);

  const totalBiaya = dataAnggaran.reduce(
    (acc, anggaran) => acc + (anggaran.total_harga || 0),
    0
  );
  const pajak = 0.1 * totalBiaya;
  const hargaPenawaran = totalBiaya + pajak;

  const handleSelectRow = (index: number) => {
    setSelectedRow(index);
    // Set form data dengan nilai baris yang dipilih untuk diedit
    setFormData({ ...dataAnggaran[index] }); // Hapus ID dari formData
  };

  const handleDeleteRow = async (index: number) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/anggaran/${dataAnggaran[index].id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage.error || "Failed to delete data");
      }

      console.log("Data anggaran berhasil dihapus");
      fetchData();
      setSelectedRow(null);
      setFormData({
        kategori: "",
        nama_item: "",
        harga: undefined,
        waktu: undefined,
        total_harga: undefined,
        keterangan: "",
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (selectedRow !== null) {
        const response = await fetch(
          `http://localhost:3001/api/anggaran/${dataAnggaran[selectedRow].id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        if (!response.ok) {
          const errorMessage = await response.json();
          throw new Error(errorMessage.error || "Failed to update data");
        }

        console.log("Data anggaran berhasil diupdate");

        const updatedData = [...dataAnggaran];
        updatedData[selectedRow] = formData;
        setDataAnggaran(updatedData);

        setSelectedRow(null);
        setFormData({
          kategori: "",
          nama_item: "",
          harga: undefined,
          waktu: undefined,
          total_harga: undefined,
          keterangan: "",
        });
      } else {
        const response = await fetch("http://localhost:3001/api/anggaran", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorMessage = await response.json();
          throw new Error(errorMessage.error || "Failed to save data");
        }

        console.log("Data anggaran berhasil disimpan");
        setFormData({
          kategori: "",
          nama_item: "",
          harga: undefined,
          waktu: undefined,
          total_harga: undefined,
          keterangan: "",
        });
        fetchData();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "waktu" || name === "harga") {
      // Calculate total_harga and update the state
      const waktu =
        name === "waktu" ? parseInt(value, 10) || 0 : formData.waktu || 0;
      const harga =
        name === "harga" ? parseFloat(value) || 0 : formData.harga || 0;
      const totalHarga = waktu * harga;

      setFormData((prevData) => ({
        ...prevData,
        total_harga: totalHarga,
      }));
    }
  };

  function handlePrint() {
    const printWindow: Window | null = window.open("", "_blank");

    const printDocument = `
      <html>
        <head>
          <title>Rencana Anggaran Biaya</title>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              border: 1px solid black;
              text-align: center;
              padding: 8px;
            }
            th.left-align, td.left-align {
              text-align: left;
            }
            h2, h3 {
              text-align: center;
            }
          </style>
        </head>
        <body style="width: 100wh;">
          <h2>Rencana Anggaran Biaya</h2>
          
          ${Object.entries(totalHargaByCategory)
            .map(
              ([kategori, totalHarga]) => `
              <table>
              <tr>
              <th colspan="5" style="text-align: left">${kategori}</th>
              </tr>
              <tr>
                  <th>No</th>
                  <th>Nama Item</th>
                  <th>Jumlah</th>
                  <th>Keterangan</th>
                  <th>Harga</th>
                </tr>
                ${dataAnggaran
                  .filter((anggaran) => anggaran.kategori === kategori)
                  .map(
                    (anggaran, index) => `
                    <tr>
                      <td>${index + 1}</td>
                      <td>${anggaran.nama_item}</td>
                      <td>${anggaran.harga}</td>
                      <td>${anggaran.keterangan}</td>
                      <td>${anggaran.total_harga}</td>
                    </tr>
                  `
                  )
                  .join("")}
                <tr>
                  <td colspan="4" class="left-align"><b>Total</b></td>
                  <td>${totalHarga}</td>
                </tr>
              </table>
            `
            )
            .join("")}
          <table>
            <tr>
              <td colspan="5" style="text-align: right; font-weight: bold;">
                Total Biaya
              </td>
              <td>${totalBiaya}</td>
            </tr>
            <tr>
              <td colspan="5" style="text-align: right; font-weight: bold;">
                Pajak 10%
              </td>
              <td>${pajak}</td>
            </tr>
            <tr>
              <td colspan="5" style="text-align: right; font-weight: bold;">
                Harga Penawaran
              </td>
              <td>${hargaPenawaran}</td>
            </tr>
          </table>
        </body>
      </html>
    `;

    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(printDocument);
      printWindow.document.close();
      printWindow.print();
    }
  }

  return (
    <>
      <div className="flex justify-between">
        <BackButton />
        <button
          className="hover:transform hover:scale-110 bg-lime-500 rounded-md text-white font-semibold mt-2 w-[200px] mr-4"
          onClick={handlePrint}
        >
          Print RAB
        </button>
      </div>
      {/* Main Container  */}
      <div className="flex flex-row">
        <div className="flex flex-col w-1/2">
          {/* FormContainer Atas*/}
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col w-full">
              <label htmlFor="" className="mx-8 mt-8 text-lg font-semibold">
                Kategori
              </label>
              <select
                className="mx-8 border-4 p-2 rounded-md"
                name="kategori"
                value={formData.kategori}
                onChange={handleChange}
              >
                <option value="Biaya Tenaga Ahli">Biaya Tenaga Ahli</option>
                <option value="Biaya Sewa">Biaya Sewa</option>
                <option value="Biaya Operasional">Biaya Operasional</option>
                <option value="Jasa Sewa Peralatan dan Penunjang">
                  Jasa Sewa Peralatan dan Penunjang
                </option>
              </select>
              <label htmlFor="" className="mx-8 mt-4 text-lg font-semibold">
                Nama Barang
              </label>
              <textarea
                className="border-4 rounded-md text-sm mx-8"
                rows={6}
                name="nama_item"
                value={formData.nama_item}
                onChange={handleChange}
              />
            </div>

            <div className="flex mx-8 space-x-6">
              <div className="flex flex-col grow">
                <label htmlFor="" className="mt-4 text-lg font-semibold">
                  Harga
                </label>
                <input
                  type="text"
                  className="border-4 p-2 rounded-md"
                  name="harga"
                  value={formData.harga}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col grow">
                <label htmlFor="" className="mt-4 text-lg font-semibold">
                  Waktu (Bulan)
                </label>
                <input
                  type="text"
                  className="border-4 p-2 rounded-md"
                  name="waktu"
                  value={formData.waktu}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label htmlFor="" className="mx-8 mt-4 text-lg font-semibold">
                Total Harga
              </label>
              <input
                type="text"
                className="border-4 p-2 rounded-md mx-8"
                name="total_harga"
                value={formData.total_harga}
                onChange={handleChange}
                disabled
              />
              <label htmlFor="" className="mx-8 mt-4 text-lg font-semibold">
                Keterangan
              </label>
              <input
                type="text"
                className="border-4 p-2 rounded-md mx-8"
                name="keterangan"
                value={formData.keterangan}
                onChange={handleChange}
              />
              <button
                type="submit"
                className="mx-8 p-2 hover:transform hover:scale-105 rounded-md mt-4 bg-green-500 text-white font-semibold"
              >
                {selectedRow !== null ? "Update Anggaran" : "Save"}
              </button>
              {selectedRow !== null && (
                <button
                  onClick={() => handleDeleteRow(selectedRow)}
                  className="mx-8 p-2 hover:transform hover:scale-105 rounded-md mt-4 bg-red-500 text-white font-semibold grow"
                  type="button"
                >
                  Delete
                </button>
              )}
            </div>
          </form>
        </div>
        {/* Tabel */}
        <div className="flex flex-col mt-8">
          <div className="max-h-[30em] overflow-auto max-w-[50em] w-full">
            {dataAnggaran.length > 0 ? (
              <table className="auto w-full bg-white rounded-lg text-slate-700 uppercase">
                <thead className="font-extralight text-sm shadow-md">
                  <tr className="">
                    <th className="p-2">No.</th>
                    <th className="px-10">Kategori</th>
                    <th className="whitespace-nowrap px-10">Nama Item</th>
                    <th className="whitespace-nowrap px-10">Harga</th>
                    <th className="px-10">Waktu</th>
                    <th className="px-10 whitespace-nowrap">Total Harga</th>
                    <th className="px-10 whitespace-nowrap">Keterangan</th>
                    <th className="px-2">Edit</th>
                    <th className="px-2">Delete</th>
                  </tr>
                </thead>
                <tbody className="text-center rounded-b-md text-sm font-semibold">
                  {dataAnggaran.map((row, index) => (
                    <tr key={index} className="border-b-2">
                      <td className="p-4">{index + 1}</td>
                      <td className="whitespace-nowrap">{row.kategori}</td>
                      <td className="whitespace-nowrap">{row.nama_item}</td>
                      <td>{row.harga}</td>
                      <td>{row.waktu} Bulan</td>
                      <td>{row.total_harga}</td>
                      <td>{row.keterangan}</td>
                      <td>
                        <button
                          onClick={() => handleSelectRow(index)}
                          className="bg-blue-500 text-white p-2 rounded-md"
                        >
                          Edit
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDeleteRow(index)}
                          className="bg-red-500 text-white p-2 rounded-md"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <h1 className="bg-red-500 text-center text-xl font-semibold text-white p-4 mt-10">
                Tidak ada data
              </h1>
            )}
          </div>

          <div className="flex justify-between items-start">
            <div className="w-[50em]">
              {dataAnggaran.length > 0 &&
                Object.entries(totalHargaByCategory).map(
                  ([kategori, totalHarga]) => (
                    <div key={kategori} className="flex-col flex my-2">
                      <label htmlFor="" className="font-semibold">
                        {kategori}
                      </label>
                      <input
                        type="text"
                        className="border-4 p-2 rounded-md"
                        value={totalHarga}
                        disabled
                      />
                    </div>
                  )
                )}

              <div className="flex-col flex my-2">
                <label htmlFor="" className="font-semibold">
                  Total Biaya
                </label>
                <input
                  type="text"
                  className="border-4 p-2 rounded-md"
                  disabled
                  value={totalBiaya}
                />
              </div>
              <div className="flex-col flex  my-2">
                <label htmlFor="" className="font-semibold">
                  Pajak 10%
                </label>
                <input
                  type="text"
                  className="border-4 p-2 rounded-md"
                  disabled
                  value={pajak}
                />
              </div>
              <div className="flex-col flex  my-2">
                <label htmlFor="" className="font-semibold">
                  Harga Penawaran
                </label>
                <input
                  type="text"
                  className="border-4 p-2 rounded-md"
                  disabled
                  value={hargaPenawaran}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormAnggaran;
