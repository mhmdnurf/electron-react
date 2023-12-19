import React from "react";
import BackButton from "../components/BackButton";
import Label from "../components/Label";
import InputField from "../components/InputField";
import FormContainer from "../components/FormContainer";
import { Link } from "react-router-dom";

interface Jadwal {
  wbs: string;
  task_proyek: string;
  tenaga_ahli: string;
  durasi?: number | undefined;
  tgl_mulai: Date;
  tgl_selesai: Date;
}

const FormJadwal = (): React.JSX.Element => {
  const [isNewClicked, setIsNewClicked] = React.useState<boolean>(false);
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [dataJadwal, setDataJadwal] = React.useState<Jadwal[]>([]);
  const [formData, setFormData] = React.useState<Jadwal>({
    wbs: "",
    task_proyek: "",
    tenaga_ahli: "Novi",
    durasi: undefined,
    tgl_mulai: new Date(),
    tgl_selesai: new Date(),
  });
  const [isFormValid, setIsFormValid] = React.useState<boolean>(false);

  React.useEffect(() => {
    fetchData();
    validateForm();
  }, [formData]);

  const fetchData = () => {
    fetch("http://localhost:3001/api/jadwal")
      .then((response) => response.json())
      .then((data) => setDataJadwal(data))
      .catch((error) => console.error("Error fetching data:", error));
  };

  const formatLocalDate = (dateString: string | Date): string => {
    if (dateString instanceof Date) {
      const year = dateString.getFullYear();
      const month = (dateString.getMonth() + 1).toString().padStart(2, "0");
      const day = dateString.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    // Check if the input is in ISO format
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(dateString)) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    return dateString;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    console.log(`Handling change for ${name}: ${value}`);

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleEdit = (jadwal: Jadwal) => {
    setIsEditing(true);
    setFormData({
      wbs: jadwal.wbs,
      task_proyek: jadwal.task_proyek,
      tenaga_ahli: jadwal.tenaga_ahli,
      durasi: jadwal.durasi,
      tgl_mulai: jadwal.tgl_mulai,
      tgl_selesai: jadwal.tgl_selesai,
    });
  };

  const validateForm = () => {
    const { wbs, task_proyek, durasi, tgl_mulai, tgl_selesai } = formData;
    const isFormValid =
      wbs !== "" &&
      task_proyek !== "" &&
      durasi != 0 &&
      tgl_mulai !== new Date() &&
      tgl_selesai !== new Date();
    setIsFormValid(isFormValid);
  };

  const handleDelete = async (wbs: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/jadwal/${wbs}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Data berhasil dihapus");
        fetchData();
        setFormData({
          wbs: "",
          task_proyek: "",
          tenaga_ahli: "Novi",
          durasi: 0,
          tgl_mulai: new Date(),
          tgl_selesai: new Date(),
        });
        setIsEditing(false);
      } else {
        console.error("Gagal menghapus data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = isEditing
        ? `http://localhost:3001/api/jadwal/${formData.wbs}`
        : "http://localhost:3001/api/jadwal";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log(
          isEditing ? "Data berhasil diubah" : "Data berhasil disimpan"
        );

        fetchData();
        setFormData({
          wbs: "",
          task_proyek: "",
          tenaga_ahli: "Novi",
          durasi: 0,
          tgl_mulai: new Date(),
          tgl_selesai: new Date(),
        });
        setIsEditing(false);
      } else {
        console.error(
          isEditing ? "Gagal mengubah data" : "Gagal menyimpan data"
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      wbs: "",
      task_proyek: "",
      tenaga_ahli: "Novi",
      durasi: 0,
      tgl_mulai: new Date(),
      tgl_selesai: new Date(),
    });
  };

  function handlePrint() {
    const printWindow: Window | null = window.open("", "_blank");

    const printDocument = `
      <html>
        <head>
          <title>Jadwal Proyek</title>
        </head>
        <body style="width: 100wh;">
        <h2 style="text-align: center;">Jadwal Proyek</h2>
          <table style="width: 100%;
          border-collapse: collapse;">
            <tr>
              <th style="border: 1px solid black; text-transform: uppercase;">No.</th>
              <th style="border: 1px solid black; text-transform: uppercase;">WBS</th>
              <th style="border: 1px solid black; text-transform: uppercase;">Task Proyek</th>
              <th style="border: 1px solid black; text-transform: uppercase;">Tenaga Ahli</th>
              <th style="border: 1px solid black; text-transform: uppercase;">Durasi</th>
              <th style="border: 1px solid black; text-transform: uppercase;">Tgl. Mulai</th>
              <th style="border: 1px solid black; text-transform: uppercase;">Tgl. Selesai</th>
            </tr>
            ${dataJadwal
              .map(
                (jadwal, index) => `
                <tr>
                  <td style="border: 1px solid black">${index + 1}</td>
                  <td style="border: 1px solid black; text-transform: uppercase;">${
                    jadwal.wbs
                  }</td>
                  <td style="border: 1px solid black; text-transform: uppercase;">${
                    jadwal.task_proyek
                  }</td>
                  <td style="border: 1px solid black; text-transform: uppercase;">${
                    jadwal.tenaga_ahli
                  }</td>
                  <td style="border: 1px solid black">${jadwal.durasi}</td>
                  <td style="border: 1px solid black">${formatLocalDate(
                    jadwal.tgl_mulai
                  )}</td>
                  <td style="border: 1px solid black">${formatLocalDate(
                    jadwal.tgl_selesai
                  )}</td>
                </tr>
              `
              )
              .join("")}
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
      <BackButton />
      <div className="flex flex-col">
        <div className="flex">
          <FormContainer>
            <Label title="WBS" />
            <div className="flex">
              <InputField
                type="text"
                width="full"
                disabled={!isNewClicked || isEditing}
                name="wbs"
                onChange={handleChange}
                value={formData.wbs}
              />
              <button
                className="p-3 hover:transform hover:scale-105 ml-4 text-lg rounded-md bg-sky-500 text-white font-semibold"
                onClick={() => {
                  setIsNewClicked(true);
                  setFormData({
                    wbs: "",
                    task_proyek: "",
                    tenaga_ahli: "Novi",
                    durasi: undefined,
                    tgl_mulai: new Date(),
                    tgl_selesai: new Date(),
                  });
                  setIsEditing(false);
                }}
              >
                New
              </button>
            </div>
            <Label title="Task Proyek" />
            <textarea
              className="w-full border-4 rounded-md text-sm"
              rows={8}
              disabled={!isNewClicked}
              name="task_proyek"
              onChange={handleChange}
              value={formData.task_proyek}
            />
          </FormContainer>
          <FormContainer>
            <Label title="Durasi (Hari)" />
            <div className="flex">
              <InputField
                type="number"
                width="full"
                name="durasi"
                onChange={handleChange}
                value={formData.durasi ?? ""}
              />
            </div>
            <Label title="Tanggal Mulai" />
            <InputField
              type="date"
              width="full"
              disabled={!isNewClicked && !isEditing}
              name="tgl_mulai"
              onChange={handleChange}
              value={formData.tgl_mulai}
            />
            <Label title="Tanggal Selesai" />
            <InputField
              type="date"
              width="full"
              disabled={!isNewClicked && !isEditing}
              name="tgl_selesai"
              onChange={handleChange}
              value={formData.tgl_selesai}
            />
          </FormContainer>
          <FormContainer>
            <Label title="Tenaga Ahli" />
            <select
              className="p-2 border-4 rounded-md text-lg font-semibold text-slate-700"
              disabled={!isNewClicked}
              value={formData.tenaga_ahli}
              onChange={(e) =>
                setFormData({ ...formData, tenaga_ahli: e.target.value })
              }
            >
              <option value="Novi">Novi</option>
              <option value="Dera">Dera</option>
            </select>
            {isEditing && (
              <button
                className="hover:transform hover:scale-105 text-lg rounded-md bg-sky-500 text-white font-semibold w-full mt-8 p-3"
                onClick={handleCancelEdit}
              >
                Cancel Edit
              </button>
            )}
            <div className="flex justify-between items-center mt-6 w-">
              <button
                className={`hover:transform hover:scale-105 text-lg rounded-md ${
                  isEditing ? "bg-yellow-500" : "bg-green-500"
                }${
                  isFormValid ? "" : " bg-opacity-50 cursor-not-allowed"
                } text-white font-semibold w-1/2  p-3`}
                onClick={handleSubmit}
                disabled={!isFormValid}
              >
                {isEditing ? "Update" : "Save"}
              </button>

              {isEditing && (
                <button
                  className="hover:transform hover:scale-105 text-lg rounded-md bg-red-500 text-white font-semibold w-1/2 ml-2 p-3"
                  onClick={() => handleDelete(formData.wbs)}
                >
                  Delete
                </button>
              )}
            </div>
          </FormContainer>
        </div>
        <h1 className="text-center text-2xl font-semibold text-slate-700 my-4">
          Tabel Jadwal Proyek
        </h1>
        <div className="flex mb-10">
          <div className="mx-10 mt-2 flex flex-col w-3/4">
            <div className="max-h-[10em] overflow-auto">
              {dataJadwal && dataJadwal.length > 0 ? (
                <table className="auto  w-full bg-white rounded-lg text-slate-700 uppercase">
                  <thead className="font-extralight text-sm shadow-md">
                    <tr className="">
                      <th className="p-2">No.</th>
                      <th className="px-10">WBS</th>
                      <th className="whitespace-nowrap">Task Proyek</th>
                      <th className="whitespace-nowrap">Tenaga Ahli</th>
                      <th className="px-10">Durasi</th>
                      <th className="px-10">Tgl.Mulai</th>
                      <th className="px-10">Tgl.Selesai</th>
                      <th className="px-10">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="text-center rounded-b-md text-sm font-semibold">
                    {dataJadwal.map((jadwal, index) => (
                      <tr key={jadwal.wbs} className="border-b-2">
                        <td className="p-4">{index + 1}</td>
                        <td>{jadwal.wbs}</td>
                        <td className="whitespace-pre-wrap-">
                          {jadwal.task_proyek}
                        </td>
                        <td>{jadwal.tenaga_ahli}</td>
                        <td>{jadwal.durasi} Hari</td>
                        <td>{formatLocalDate(jadwal.tgl_mulai)}</td>
                        <td>{formatLocalDate(jadwal.tgl_selesai)}</td>
                        <td>
                          <button
                            className="hover:transform hover:scale-105 text-lg rounded-md bg-sky-500 text-white font-semibold ml-2 p-1"
                            onClick={() => handleEdit(jadwal)}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center text-lg font-semibold text-slate-700 mt-10">
                  Tidak ada data jadwal
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <button
              className="hover:transform hover:scale-105 text-lg rounded-md bg-lime-500 text-white font-semibold w-full p-3"
              onClick={handlePrint}
            >
              Print Jadwal
            </button>
            <Link
              to={"/"}
              className="text-center hover:transform hover:scale-105 text-lg rounded-md bg-amber-500 text-white font-semibold w-full mt-4 p-3"
            >
              Menu
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormJadwal;
