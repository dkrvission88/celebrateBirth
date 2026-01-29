import React, { useState, useEffect } from "react";
import "./ftp.css"
// import { BACKEND_URL } from "../../../services/Helper";
import axios from "axios";
import {
  stateStationMap,
  stateStationMap1,
  stateStationMap2,
} from "./stations";
import { FileStatsChart, FilePieChart } from "./FileStatsChart";
// import Sidebar from "../../layout/Sidebar";

function App() {
  let BACKEND_URL=`http://localhost:3001`
  const [dataselect, SetDataSelect] = useState("");
  const [hataRe2D, SetHatare2D] = useState("");
  const [mainUrl, setMainUrl] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [jdsingle, SetJdSingle] = useState("");
  const [singlemore, setSinglemore] = useState("");

  const [selectedStates, setSelectedStates] = useState([]);
  const [availableStations, setAvailableStations] = useState([]);
  const [selectedStations, setSelectedStations] = useState([]);
  const [formData, setFormData] = useState({
    localDirectory: "",
    startYear: "",
    endYear: "",
    startDate: "",
    endDate: "",
    stations: "",
    mainUrl: "",
  });

  const [fileCheckResult, setFileCheckResult] = useState(null);
  const [downloadLogs, setDownloadLogs] = useState(null);
  const [checking, setChecking] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [fileCount, setFileCount] = useState("");
  const [downloadProgress,setDownloadProgress] = useState(0);
  const [downloadProgressmsg,setDownloadProgressmsg] = useState('');
  console.log(downloadProgressmsg);


  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 12;

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows =
    fileCheckResult && fileCheckResult.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = fileCheckResult
    ? Math.ceil(fileCheckResult.length / rowsPerPage)
    : 0;

    

    useEffect(() => {
  if (!formData.userId) {
    const randomId = `user-${Math.floor(Math.random() * 100000)}`;
    setFormData(prev => ({ ...prev, userId: randomId }));
  }
}, []);


  useEffect(() => {
    let url = dataselect;
    if (
      dataselect === "Region 2 Hatanaka" ||
      dataselect === "CORS_archive" ||
      dataselect === "Region 2 Raw Data" ||
      (dataselect === "Region_1_Hatanaka" && hataRe2D)
    ) {
      url += hataRe2D;
    }
    setMainUrl(url);
  }, [dataselect, hataRe2D]);

  useEffect(() => {
    let mapToUse = stateStationMap;
    if (
      dataselect === "Region 1 Raw Data" ||
      dataselect === "Region_1_Hatanaka"
    ) {
      mapToUse = stateStationMap1;
    } else if (
      dataselect === "Region 2 Raw Data" ||
      dataselect === "Region 2 Hatanaka"
    ) {
      mapToUse = stateStationMap2;
    }

    const combinedStations = selectedStates.flatMap(
      (state) => mapToUse[state] || []
    );
    setAvailableStations(combinedStations);
    setSelectedStations([]);
  }, [selectedStates, dataselect]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const payload = {
    ...formData,
    mainUrl,
    startYearC: new Date(startDate).getFullYear(),
    endYearC: new Date(endDate).getFullYear(),
    startMonth: new Date(startDate).getMonth() + 1,
    endMonth: new Date(endDate).getMonth() + 1,
    startDay: new Date(startDate).getDate(),
    endDay: new Date(endDate).getDate(),
  };

  const handleCheck = async (e) => {
    e.preventDefault();
    setChecking(true);
    setFileCheckResult(null);
    setDownloadLogs(null);
    setCurrentPage(1);

    try {
      const response = await axios.post(
        `${BACKEND_URL}/Ftp/api/check`,
        payload
      );
      setFileCheckResult(response.data.files);
      setFileCount(response.data.total);
    } catch (err) {
      setFileCheckResult([{ error: err.message }]);
    } finally {
      setChecking(false);
    }
  };
  const handleDownload = async () => {
  setDownloading(true);
  setDownloadLogs(null);
  setDownloadProgress(0);

  try {
    const response = await axios.post(
      `${BACKEND_URL}/Ftp/api/download`,
      {
        userId: formData.userId, 
        localDirectory: formData.localDirectory,
        files: fileCheckResult,
      },
      {
        responseType:'blob',
        timeout: 0,
        onDownloadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setDownloadProgress(percentCompleted);
        },
      }
    );
    // console.log(response);

    const contentType = response.headers['content-type'];

    if (!contentType || !contentType.includes('application/zip')) {
      const reader = new FileReader();
      reader.onload = () => {
        setDownloadLogs({ error: reader.result || 'Download failed.' });
      };
      reader.readAsText(response.data);
      console.log(response.data);
      console.log(response);
      return;
    }
    // console.log(response.data);


    const blob = new Blob([response.data], { type: 'application/zip' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'FTP_Downloads.zip';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    setDownloadLogs({ message: "Download completed." }); 

  } catch (err) {
    console.log(err);
    setDownloadLogs({ error: err.message });
  } finally {
    setDownloading(false);
    setDownloadProgress(0);
  }
};
// console.log(downloadLogs);


//   const handleDownload = async () => {
//   setDownloading(true);
//   setDownloadLogs(null);
//   setDownloadProgress(0);

//   try {
//     const response = await axios.post(
//       `${BACKEND_URL}/Ftp/api/download`,
//       {
//         localDirectory: formData.localDirectory,
//         files: fileCheckResult,
//       },
//       {
//         responseType: 'blob',
//         timeout: 0,
//         onDownloadProgress: (progressEvent) => {
//           const percentCompleted = Math.round(
//             (progressEvent.loaded * 100) / progressEvent.total
//           );
//           setDownloadProgress(percentCompleted);
//         },
//       }
//     );

//     // Check if it's really a ZIP or an error response
//     const contentType = response.headers['content-type'];
//     if (!contentType || !contentType.includes('application/zip')) {
//       // Read the text response and show error
//       const reader = new FileReader();
//       reader.onload = () => {
//         setDownloadLogs({ error: reader.result || 'Download failed.' });
//       };
//       reader.readAsText(response.data);
//       return;
//     }

//     const blob = new Blob([response.data], { type: 'application/zip' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'FTP_Downloads.zip';
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//     window.URL.revokeObjectURL(url);
//   } catch (err) {
//     console.error("Download error:", err);
//     setDownloadLogs({ error: err.message });
//   } finally {
//     setDownloading(false);
//     setDownloadProgress(0);
//   }
// };




  // const handleDownload = async () => {
  //   setDownloading(true);
  //   setDownloadLogs(null);
  //   setDownloadProgress(0);
  //   try {
  //     const response = await axios.post(`${BACKEND_URL}/Ftp/api/download`, {
  //       localDirectory: formData.localDirectory,
  //       files: fileCheckResult,
  //     },{
  //       responseType: 'blob',
  //       onDownloadProgress: (progressEvent) => {
  //         const percentCompleted = Math.round(
  //           (progressEvent.loaded * 100) / progressEvent.total
  //         );
  //         setDownloadProgress(percentCompleted); // Update state
  //       },
  //     });
  //     const blob = new Blob([response.data], { type: 'application/zip' });
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = 'FTP_Downloads.zip'; // Desired file name
  //     document.body.appendChild(a);
  //     a.click();
  //     a.remove();
  //     window.URL.revokeObjectURL(url);
  //     // setDownloadLogs(response.data);
  //   //   setDownloadLogs({
  //   //   message: response.data.message,
  //   //   queuePosition: response.data.queuePosition,
  //   //   success: response.data.success, 
  //   // })
  //   } catch (err) {
  //     setDownloadLogs({ error: err.message });
  //   } finally {
  //     setDownloading(false);
  //     setDownloadProgress(0);
  //   }
  // };
  const getUniqueStations = (data) => {
    const set = new Set();
    data.forEach((item) => {
      if (item.available && item.station) {
        set.add(item.station);
      }
    });
    return Array.from(set).sort();
  };
  const getDateStationMatrix = (data, stations) => {
    const matrix = {};

    data.forEach((item) => {
      if (!item.date || !item.station) return;
      if (!matrix[item.date]) {
        matrix[item.date] = {};
      }
      matrix[item.date][item.station] = item.available;
    });

    return Object.entries(matrix).map(([date, availability]) => ({
      date,
      availability,
    }));
  };


  useEffect(() => {
  if (!formData.userId || !downloading) return;

  const evtSource = new EventSource(`${BACKEND_URL}/Ftp/api/progress?userId=${formData.userId}`);

  evtSource.onmessage = function (event) {
    const data = JSON.parse(event.data);
    console.log("SSE Progress update:", data);

    // if (data.progress !== undefined) {
      setDownloadProgressmsg(data);
    // }

    if (data.done) {
      console.log("SSE Download complete!");
      evtSource.close();
    }
  };

  evtSource.onerror = function (err) {
    console.error("SSE error:", err);
    evtSource.close(); // optional: close on error
  };

  return () => {
    evtSource.close(); // Cleanup on unmount
  };
}, [formData.userId, downloading]);


  return (
    // <Sidebar>
      <div
        className="container mt-4 "
        style={{
          backgroundColor:"whitesmoke",
          padding: "10px",
          borderRadius: "12px",
        }}
      >
        <h2 className="text-center mb-4">FTP File Checker & Downloader</h2>
        <form onSubmit={handleCheck} className="row g-3 h-auto " >
          <div className="col-md-6">
            <label className="form-label">Select Data Source</label>
            <select
              className="form-select"
              required
              onChange={(e) => SetDataSelect(e.target.value)}
            >
              <option value="">Select Source</option>
              <option value="CORS_archive">CORS Archive</option>
              <option value="Region 1 Raw Data">Region 1 Raw Data</option>
              <option value="Region 2 Raw Data">Region 2 Raw Data</option>
              <option value="Region_1_Hatanaka">Region_1_Hatanaka</option>
              <option value="Region 2 Hatanaka">Region 2 Hatanaka</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Data Selection Type</label>
            <select
              className="form-select"
              required
              onChange={(e) => SetJdSingle(e.target.value)}
            >
              <option value="">Select Type</option>
              <option value="dateWise">Date Wise</option>
              <option value="julianWise">Julian Date Wise</option>
              <option value="singleDate">Single Date</option>
            </select>
          </div>

          {(dataselect === "Region 2 Hatanaka" ||
            dataselect === "Region_1_Hatanaka") && (
            <div className="col-12">
              <select
                className="form-select"
                required
                onChange={(e) => SetHatare2D(e.target.value)}
              >
                <option value="">Select Format</option>
                <option value="/Daily">Daily</option>
                <option value="/Hourly">Hourly</option>
              </select>
            </div>
          )}

          {dataselect === "CORS_archive" && (
            <div className="col-12">
              <select
                className="form-select"
                onChange={(e) => SetHatare2D(e.target.value)}
                required
              >
                <option value=''>Select Format</option>
                <option value="/RINEX_DAILY">Daily</option>
                <option value="/RINEX_Hourly">Hourly</option>
              </select>
            </div>
          )}

          {dataselect === "Region 2 Raw Data" && (
            <div className="col-12">
              <select
                className="form-select"
                required
                onChange={(e) => SetHatare2D(e.target.value)}
              >
                <option value="">Select Format</option>
                <option value="/1HR">1HR</option>
                <option value="/24HR">24H</option>
              </select>
            </div>
          )}
          {jdsingle === "julianWise" && (
            <>
              <div className="col-md-6">
                <label className="form-label">Start Year</label>
                <input
                  type="number"
                  className="form-control"
                  name="startYear"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">End Year</label>
                <input
                  type="number"
                  className="form-control"
                  name="endYear"
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          {(jdsingle === "dateWise" || jdsingle === "singleDate") && (
            <div className="col-md-6">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
          )}

          {jdsingle === "dateWise" && (
            <div className="col-md-6">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          )}

          {jdsingle === "julianWise" && (
            <>
              <div className="col-md-6">
                <label className="form-label">Start Julian Day</label>
                <input
                  type="number"
                  className="form-control"
                  name="startDate"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">End Julian Day</label>
                <input
                  type="number"
                  className="form-control"
                  name="endDate"
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          <div className="col-md-6" >
            <label className="form-label">Select State(s)</label>
            <select
              multiple
              className="form-select h-90 d-inline-block mb-4" style={{height:"90%"}}
              required
              value={selectedStates}
              onChange={(e) => {
                const clickedOptions = Array.from(e.target.options)
                  .filter((option) => option.selected)
                  .map((option) => option.value);

                const lastClicked = e.target.value;
                setSelectedStates((prev) => {
                  if (prev.includes(lastClicked)) {
                    return prev.filter((state) => state !== lastClicked);
                  } else {
                    return [...prev, lastClicked];
                  }
                });
              }}
            >
              <option disabled>-- Select State --</option> 
              {Object.keys(
                dataselect === "Region 1 Raw Data" ||
                  dataselect === "Region_1_Hatanaka"
                  ? stateStationMap1
                  : dataselect === "Region 2 Raw Data" ||
                    dataselect === "Region 2 Hatanaka"
                  ? stateStationMap2
                  : stateStationMap
              ).map((state) => (
                <option key={state} value={state} style={{padding:'7px'}}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {availableStations.length > 0 && (
            <div className="col-md-6 ">
              <label className="form-label">Select Stations</label>
              <select
                multiple
                className="form-select p-3  d-inline-block  w-100 mb-1" style={{height:"90%"}}
                value={selectedStations}
                onChange={(e) => {
                  const selectedCodes = Array.from(
                    e.target.selectedOptions,
                    (opt) => opt.value
                  );
                  const merged = Array.from(
                    new Set([...selectedStations, ...selectedCodes])
                  );
                  setSelectedStations(merged);
                  setFormData((prev) => ({
                    ...prev,
                    stations: merged.join(" "),
                  }));
                }}
              >
                {availableStations.map((station) => (
                  <option key={station.code} value={station.code} style={{padding:"8px"}}>
                    {station.name} ({station.code})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="col-md-6 ">
            <label className="form-label">Local Directory</label>
            <input
              type="text"
              className="form-control"
              name="localDirectory"
              onChange={handleChange}
              placeholder="Leave empty for default"
            />
          </div>

          <div className="col-md-6 ">
            <label className="form-label">Stations (space-separated)</label>
            <textarea
              className="form-control"
              rows="2"
              name="stations"
              value={formData.stations}
              onChange={(e) => {
                const inputValue = e.target.value.toUpperCase();
                const stationArray = inputValue
                  .split(" ")
                  .map((s) => s.trim())
                  .filter(Boolean);
                setFormData((prev) => ({
                  ...prev,
                  stations: stationArray.join(" "),
                }));
                setSelectedStations(stationArray);
              }}
              required
            />
          </div>

          <div className="col-12 d-flex justify-content-center gap-3 mt-3">
            <button type="submit" className="btn btn-info" disabled={checking || downloadProgressmsg?.done === false }>
              {checking ? "Checking..." : "Check File Availability"}
            </button>

            {fileCheckResult && (
              <button
                className="btn btn-primary"
                onClick={handleDownload}
                disabled={downloading}
              >
               Download Files
              </button>
            )}
          </div>
          {downloadProgressmsg && downloadProgressmsg.done==false &&(
            <div className="d-flex justify-content-center gap-3 mt-3">
              <div className="progress" style={{ width: "80%", height: "50px",padding:'10px' }}>
                <h4 style={{ textAlign:'center' }} >
                  {downloadProgressmsg.status}
                </h4>
              </div>

            </div>

          )}
          {downloading && downloadProgress > 0 && (
              <div className="d-flex justify-content-center gap-3 mt-3">
                <div className="progress" style={{ width: "80%", height: "25px" }}>
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated bg-success"
                  role="progressbar"
                  style={{ width: `${downloadProgress}%` }}
                  aria-valuenow={downloadProgress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  Downloading: {downloadProgress}%
                </div>
                </div>
              </div>
            )}
        </form>

        {fileCheckResult && (
          <div className="mt-5">
            <div className="row align-items-center">
              <div className="col-md-6">
                <FilePieChart fileCount={fileCount} />
              </div>
              <div className="col-md-6">
                <h5 className="mt-4">File Availability</h5>
                <ul>
                  <li>
                    Total: <strong>{fileCount.totalChecked}</strong>
                  </li>
                  <li>
                    Available: <strong>{fileCount.totalAvailable}</strong>
                  </li>
                  <li>
                    Missing: <strong>{fileCount.totalMissing}</strong>
                  </li>
                </ul>
              </div>
            </div>

            <FileStatsChart fileData={fileCheckResult} />

            {fileCheckResult && (
              <div className="mt-5">
                <h5> Station Availability Matrix</h5>

                <div
                  style={{
                    maxHeight: "500px",
                    overflowY: "auto",
                    overflowX: "auto",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                  }}
                >
                  <table className="table table-bordered table-striped mb-0">
                    <thead>
                      <tr>
                        <th
                          style={{
                            position: "sticky",
                            top: 0,
                            background: "#fff",
                            zIndex: 1,
                          }}
                        >
                          Date
                        </th>
                        {getUniqueStations(fileCheckResult).map((station) => (
                          <th key={station}
        style={{
          position: "sticky",
          top: 0,
          background: "#fff",
          zIndex: 1,
        }}>{station}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {getDateStationMatrix(
                        fileCheckResult,
                        getUniqueStations(fileCheckResult)
                      ).map((row, idx) => (
                        <tr key={idx}>
                          <td
                            style={{
                              position: "sticky",
                              left: 0,
                              background: "#f9f9f9",
                              zIndex: 1,
                            }}
                          >
                            {row.date}
                          </td>
                          {getUniqueStations(fileCheckResult).map((station) => (
                            <td key={station} className="text-center">
                              {row.availability[station] ? "Y" : "N"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <table className="table table-bordered mt-4">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Station</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((file, idx) => (
                  <tr key={idx}>
                    {file.error ? (
                      <td colSpan="3" className="text-danger fw-bold">
                        {file.error}
                      </td>
                    ) : (
                      <>
                        <td>{file.date}</td>
                        <td>{file.station}</td>
                        <td
                          className={
                            file.available ? "text-success" : "text-warning"
                          }
                        >
                          <strong>
                            {file.available ? "Available" : "Missing"}
                          </strong>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="d-flex justify-content-center align-items-center gap-3 mb-4">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {downloading && downloadProgressmsg > 0 && (
  <div className="d-flex justify-content-center gap-3 mt-3">
    <div className="progress" style={{ width: "80%", height: "25px" }}>
      <div
        className="progress-bar progress-bar-striped progress-bar-animated bg-success"
        role="progressbar"
        style={{ width: `${downloadProgressmsg}%` }}
        aria-valuenow={downloadProgressmsg}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        Downloading: {downloadProgressmsg}%
      </div>
    </div>
  </div>
)}


        {/* {downloadLogs && (
  <div className="mt-4 mb-4">
    <h5>Download Status</h5>

    {downloadLogs.error && (
      <div className="alert alert-danger">{downloadLogs.error}</div>
    )}

    {downloadLogs.message && (
      <div className="alert alert-success">
        <p>{downloadLogs.message}</p>
        {downloadLogs.queuePosition && (
          <p>
            <strong>Queue Position:</strong> {downloadLogs.queuePosition}
          </p>
        )}
      </div>
    )}

    {downloadLogs.success && Array.isArray(downloadLogs.success) && (
      <div className="mt-3">
        <h6>Downloaded Files:</h6>
        <ul>
          {downloadLogs.success.map((log, idx) => (
            <li key={idx}>{log}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
)} */}


       

          
      </div>
    // </Sidebar>
  );
}

export default App;

// import React, { useState, useEffect } from "react";
// // import { BACKEND_URL } from "../../services/Helper";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import axios from "axios";
// import {
//   stateStationMap,
//   stateStationMap1,
//   stateStationMap2,
// } from "./stations";
// import { FileStatsChart, FilePieChart } from "./FileStatsChart";
// // import Sidebar from "../layout/Sidebar";

// function App() {
//   let BACKEND_URL=`http://localhost:3001`
//   const [dataselect, SetDataSelect] = useState("");
//   const [hataRe2D, SetHatare2D] = useState("");
//   const [mainUrl, setMainUrl] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [jdsingle, SetJdSingle] = useState("");
//   const [singlemore, setSinglemore] = useState("");

//   const [selectedStates, setSelectedStates] = useState([]);
//   const [availableStations, setAvailableStations] = useState([]);
//   const [selectedStations, setSelectedStations] = useState([]);
//   const [formData, setFormData] = useState({
//     localDirectory: "",
//     startYear: "",
//     endYear: "",
//     startDate: "",
//     endDate: "",
//     stations: "",
//     mainUrl: "",
//   });

//   const [fileCheckResult, setFileCheckResult] = useState(null);
//   const [downloadLogs, setDownloadLogs] = useState(null);
//   const [checking, setChecking] = useState(false);
//   const [downloading, setDownloading] = useState(false);
//   const [fileCount, setFileCount] = useState("");
//   const [downloadProgress,setDownloadProgress] = useState(0);

//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 12;

//   const indexOfLastRow = currentPage * rowsPerPage;
//   const indexOfFirstRow = indexOfLastRow - rowsPerPage;
//   const currentRows =
//     fileCheckResult && fileCheckResult.slice(indexOfFirstRow, indexOfLastRow);
//   const totalPages = fileCheckResult
//     ? Math.ceil(fileCheckResult.length / rowsPerPage)
//     : 0;

//   useEffect(() => {
//     let url = dataselect;
//     if (
//       dataselect === "Region 2 Hatanaka" ||
//       dataselect === "CORS_archive" ||
//       dataselect === "Region 2 Raw Data" ||
//       (dataselect === "Region_1_Hatanaka" && hataRe2D)
//     ) {
//       url += hataRe2D;
//     }
//     setMainUrl(url);
//   }, [dataselect, hataRe2D]);

//   useEffect(() => {
//     let mapToUse = stateStationMap;
//     if (
//       dataselect === "Region 1 Raw Data" ||
//       dataselect === "Region_1_Hatanaka"
//     ) {
//       mapToUse = stateStationMap1;
//     } else if (
//       dataselect === "Region 2 Raw Data" ||
//       dataselect === "Region 2 Hatanaka"
//     ) {
//       mapToUse = stateStationMap2;
//     }

//     const combinedStations = selectedStates.flatMap(
//       (state) => mapToUse[state] || []
//     );
//     setAvailableStations(combinedStations);
//     setSelectedStations([]);
//   }, [selectedStates, dataselect]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const payload = {
//     ...formData,
//     mainUrl,
//     startYearC: new Date(startDate).getFullYear(),
//     endYearC: new Date(endDate).getFullYear(),
//     startMonth: new Date(startDate).getMonth() + 1,
//     endMonth: new Date(endDate).getMonth() + 1,
//     startDay: new Date(startDate).getDate(),
//     endDay: new Date(endDate).getDate(),
//   };

//   const handleCheck = async (e) => {
//     e.preventDefault();
//     setChecking(true);
//     setFileCheckResult(null);
//     setDownloadLogs(null);
//     setCurrentPage(1);

//     try {
//       const response = await axios.post(
//         `${BACKEND_URL}/api/ftp/ftp-check`,
//         payload
//       );
//       setFileCheckResult(response.data.files);
//       setFileCount(response.data.total);
//     } catch (err) {
//       setFileCheckResult([{ error: err.message }]);
//     } finally {
//       setChecking(false);
//     }
//   };

//   const handleDownload = async () => {
//     setDownloading(true);
//     setDownloadLogs(null);
//     setDownloadProgress(0);
//     try {
//       const response = await axios.post(`${BACKEND_URL}/api/ftp/ftp-download`, {
//         localDirectory: formData.localDirectory,
//         files: fileCheckResult,
//       },{
//         responseType: 'blob',
//         onDownloadProgress: (progressEvent) => {
//           const percentCompleted = Math.round(
//             (progressEvent.loaded * 100) / progressEvent.total
//           );
//           setDownloadProgress(percentCompleted); // Update state
//         },
//       });
//       const blob = new Blob([response.data], { type: 'application/zip' });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = 'FTP_Downloads.zip'; // Desired file name
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       window.URL.revokeObjectURL(url);
//       // setDownloadLogs(response.data);
//     } catch (err) {
//       setDownloadLogs({ error: err.message });
//     } finally {
//       setDownloading(false);
//       setDownloadProgress(0);
//     }
//   };
//   const getUniqueStations = (data) => {
//     const set = new Set();
//     data.forEach((item) => {
//       if (item.available && item.station) {
//         set.add(item.station);
//       }
//     });
//     return Array.from(set).sort();
//   };
//   const getDateStationMatrix = (data, stations) => {
//     const matrix = {};

//     data.forEach((item) => {
//       if (!item.date || !item.station) return;
//       if (!matrix[item.date]) {
//         matrix[item.date] = {};
//       }
//       matrix[item.date][item.station] = item.available;
//     });

//     return Object.entries(matrix).map(([date, availability]) => ({
//       date,
//       availability,
//     }));
//   };


//   // --- Julian Day Calculator ---
// function getJulianDay(date) {
//   const start = new Date(date.getFullYear(), 0, 0);
//   const diff =
//     (date - start + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000) /
//     86400000;
//   return Math.floor(diff);
// }

// // --- Custom Input with Julian ---
// const JulianInput = React.forwardRef(({ value, onClick, selectedDate }, ref) => {
//   const julian = selectedDate ? getJulianDay(new Date(selectedDate)) : "";
//   const datePart = selectedDate ? new Date(selectedDate).toDateString() : "Select Date";
//   return (
//     <button
//       className="form-control text-start"
//       onClick={onClick}
//       ref={ref}
//       type="button"
//     >
//       {datePart} {julian && `(JD ${julian})`}
//     </button>
//   );
// });

//   return (
//     // <Sidebar>
//       <div
//         className="container mt-4"
//         style={{
//           backgroundColor: "whitesmoke",
//           padding: "10px",
//           borderRadius: "12px",
//         }}
//       >
//         <h2 className="text-center mb-4">FTP File Checker & Downloader</h2>
//         <form onSubmit={handleCheck} className="row g-3">
//           <div className="col-md-6">
//             <label className="form-label">Select Data Source</label>
//             <select
//               className="form-select"
//               required
//               onChange={(e) => SetDataSelect(e.target.value)}
//             >
//               <option value="">Select Source</option>
//               <option value="CORS_archive">CORS Archive</option>
//               <option value="Region 1 Raw Data">Region 1 Raw Data</option>
//               <option value="Region 2 Raw Data">Region 2 Raw Data</option>
//               <option value="Region_1_Hatanaka">Region_1_Hatanaka</option>
//               <option value="Region 2 Hatanaka">Region 2 Hatanaka</option>
//             </select>
//           </div>

//           <div className="col-md-6">
//             <label className="form-label">Data Selection Type</label>
//             <select
//               className="form-select"
//               required
//               onChange={(e) => SetJdSingle(e.target.value)}
//             >
//               <option>Select Type</option>
//               <option value="dateWise">Date Wise</option>
//               <option value="julianWise">Julian Date Wise</option>
//               <option value="singleDate">Single Date</option>
//             </select>
//           </div>

//           {(dataselect === "Region 2 Hatanaka" ||
//             dataselect === "Region_1_Hatanaka") && (
//             <div className="col-12">
//               <select
//                 className="form-select"
//                 required
//                 onChange={(e) => SetHatare2D(e.target.value)}
//               >
//                 <option value="">Select Format</option>
//                 <option value="/Daily">Daily</option>
//                 <option value="/Hourly">Hourly</option>
//               </select>
//             </div>
//           )}

//           {dataselect === "CORS_archive" && (
//             <div className="col-12">
//               <select
//                 className="form-select"
//                 required
//                 onChange={(e) => SetHatare2D(e.target.value)}
//               >
//                 <option>Select Format</option>
//                 <option value="/RINEX_DAILY">Daily</option>
//                 <option value="/RINEX_Hourly">Hourly</option>
//               </select>
//             </div>
//           )}

//           {dataselect === "Region 2 Raw Data" && (
//             <div className="col-12">
//               <select
//                 className="form-select"
//                 required
//                 onChange={(e) => SetHatare2D(e.target.value)}
//               >
//                 <option value="">Select Format</option>
//                 <option value="/1HR">1HR</option>
//                 <option value="/24HR">24H</option>
//               </select>
//             </div>
//           )}
//           {jdsingle === "julianWise" && (
//             <>
//               <div className="col-md-6">
//                 <label className="form-label">Start Year</label>
//                 <input
//                   type="number"
//                   className="form-control"
//                   name="startYear"
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div className="col-md-6">
//                 <label className="form-label">End Year</label>
//                 <input
//                   type="number"
//                   className="form-control"
//                   name="endYear"
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//             </>
//           )}

//           {/* {(jdsingle === "dateWise" || jdsingle === "singleDate") && (
//             <div className="col-md-6">
//               <label className="form-label">Start Date</label>
//               <input
//                 type="date"
//                 className="form-control"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//                 required
//               />
//             </div>
//           )} */}

//             {(jdsingle === "dateWise" || jdsingle === "singleDate") && (
//           <div className="col-md-6">
//             <label className="form-label">Start Date (Julian)</label>
//             <DatePicker
//               selected={startDate ? new Date(startDate) : null}
//               onChange={(date) => setStartDate(date.toISOString().split("T")[0])}
//               customInput={<JulianInput selectedDate={startDate} />}
//               className="form-control"
//               dateFormat="yyyy-MM-dd"
//               required
//             />
//           </div>
//         )}

//           {jdsingle === "dateWise" && (
//             <div className="col-md-6">
//               <label className="form-label">End Date</label>
//               <input
//                 type="date"
//                 className="form-control"
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//                 required
//               />
//             </div>
//           )}

//           {jdsingle === "julianWise" && (
//             <>
//               <div className="col-md-6">
//                 <label className="form-label">Start Julian Day</label>
//                 <input
//                   type="number"
//                   className="form-control"
//                   name="startDate"
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div className="col-md-6">
//                 <label className="form-label">End Julian Day</label>
//                 <input
//                   type="number"
//                   className="form-control"
//                   name="endDate"
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//             </>
//           )}

//           <div className="col-md-6">
//             <label className="form-label">Select State(s)</label>
//             <select
//               multiple
//               className="form-select"
//               required
//               value={selectedStates}
//               onChange={(e) => {
//                 const clickedOptions = Array.from(e.target.options)
//                   .filter((option) => option.selected)
//                   .map((option) => option.value);

//                 const lastClicked = e.target.value;
//                 setSelectedStates((prev) => {
//                   if (prev.includes(lastClicked)) {
//                     return prev.filter((state) => state !== lastClicked);
//                   } else {
//                     return [...prev, lastClicked];
//                   }
//                 });
//               }}
//             >
//               <option disabled>-- Select State --</option>
//               {Object.keys(
//                 dataselect === "Region 1 Raw Data" ||
//                   dataselect === "Region_1_Hatanaka"
//                   ? stateStationMap1
//                   : dataselect === "Region 2 Raw Data" ||
//                     dataselect === "Region 2 Hatanaka"
//                   ? stateStationMap2
//                   : stateStationMap
//               ).map((state) => (
//                 <option key={state} value={state}>
//                   {state}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {availableStations.length > 0 && (
//             <div className="col-md-6">
//               <label className="form-label">Select Stations</label>
//               <select
//                 multiple
//                 className="form-select"
//                 value={selectedStations}
//                 onChange={(e) => {
//                   const selectedCodes = Array.from(
//                     e.target.selectedOptions,
//                     (opt) => opt.value
//                   );
//                   const merged = Array.from(
//                     new Set([...selectedStations, ...selectedCodes])
//                   );
//                   setSelectedStations(merged);
//                   setFormData((prev) => ({
//                     ...prev,
//                     stations: merged.join(" "),
//                   }));
//                 }}
//               >
//                 {availableStations.map((station) => (
//                   <option key={station.code} value={station.code}>
//                     {station.name} ({station.code})
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}

//           <div className="col-md-6">
//             <label className="form-label">Local Directory</label>
//             <input
//               type="text"
//               className="form-control"
//               name="localDirectory"
//               onChange={handleChange}
//               placeholder="Leave empty for default"
//             />
//           </div>

//           <div className="col-md-6">
//             <label className="form-label">Stations (space-separated)</label>
//             <textarea
//               className="form-control"
//               rows="2"
//               name="stations"
//               value={formData.stations}
//               onChange={(e) => {
//                 const inputValue = e.target.value.toUpperCase();
//                 const stationArray = inputValue
//                   .split(" ")
//                   .map((s) => s.trim())
//                   .filter(Boolean);
//                 setFormData((prev) => ({
//                   ...prev,
//                   stations: stationArray.join(" "),
//                 }));
//                 setSelectedStations(stationArray);
//               }}
//               required
//             />
//           </div>

//           <div className="col-12 d-flex justify-content-center gap-3 mt-3">
//             <button type="submit" className="btn btn-info" disabled={checking}>
//               {checking ? "Checking..." : "Check File Availability"}
//             </button>

//             {fileCheckResult && (
//               <button
//                 className="btn btn-primary"
//                 onClick={handleDownload}
//                 disabled={downloading}
//               >
//                Download Files
//               </button>
//             )}
//           </div>
//           {downloading && downloadProgress > 0 && (
//               <div className="d-flex justify-content-center gap-3 mt-3">
//                 <div className="progress" style={{ width: "80%", height: "25px" }}>
//                 <div
//                   className="progress-bar progress-bar-striped progress-bar-animated bg-success"
//                   role="progressbar"
//                   style={{ width: `${downloadProgress}%` }}
//                   aria-valuenow={downloadProgress}
//                   aria-valuemin="0"
//                   aria-valuemax="100"
//                 >
//                   Downloading: {downloadProgress}%
//                 </div>
//                 </div>
//               </div>
//             )}
//         </form>

//         {fileCheckResult && (
//           <div className="mt-5">
//             <div className="row align-items-center">
//               <div className="col-md-6">
//                 <FilePieChart fileCount={fileCount} />
//               </div>
//               <div className="col-md-6">
//                 <h5 className="mt-4">File Availability</h5>
//                 <ul>
//                   <li>
//                     Total: <strong>{fileCount.totalChecked}</strong>
//                   </li>
//                   <li>
//                     Available: <strong>{fileCount.totalAvailable}</strong>
//                   </li>
//                   <li>
//                     Missing: <strong>{fileCount.totalMissing}</strong>
//                   </li>
//                 </ul>
//               </div>
//             </div>

//             <FileStatsChart fileData={fileCheckResult} />

//             {fileCheckResult && (
//               <div className="mt-5">
//                 <h5> Station Availability Matrix</h5>

//                 <div
//                   style={{
//                     maxHeight: "500px",
//                     overflowY: "auto",
//                     overflowX: "auto",
//                     border: "1px solid #ddd",
//                     borderRadius: "6px",
//                   }}
//                 >
//                   <table className="table table-bordered table-striped mb-0">
//                     <thead>
//                       <tr>
//                         <th
//                           style={{
//                             position: "sticky",
//                             left: 0,
//                             background: "#fff",
//                             zIndex: 1,
//                           }}
//                         >
//                           Date
//                         </th>
//                         {getUniqueStations(fileCheckResult).map((station) => (
//                           <th key={station}>{station}</th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {getDateStationMatrix(
//                         fileCheckResult,
//                         getUniqueStations(fileCheckResult)
//                       ).map((row, idx) => (
//                         <tr key={idx}>
//                           <td
//                             style={{
//                               position: "sticky",
//                               left: 0,
//                               background: "#f9f9f9",
//                               zIndex: 1,
//                             }}
//                           >
//                             {row.date}
//                           </td>
//                           {getUniqueStations(fileCheckResult).map((station) => (
//                             <td key={station} className="text-center">
//                               {row.availability[station] ? "Y" : "N"}
//                             </td>
//                           ))}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}

//             <table className="table table-bordered mt-4">
//               <thead>
//                 <tr>
//                   <th>Date</th>
//                   <th>Station</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentRows.map((file, idx) => (
//                   <tr key={idx}>
//                     {file.error ? (
//                       <td colSpan="3" className="text-danger fw-bold">
//                         {file.error}
//                       </td>
//                     ) : (
//                       <>
//                         <td>{file.date}</td>
//                         <td>{file.station}</td>
//                         <td
//                           className={
//                             file.available ? "text-success" : "text-warning"
//                           }
//                         >
//                           <strong>
//                             {file.available ? "Available" : "Missing"}
//                           </strong>
//                         </td>
//                       </>
//                     )}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {totalPages > 1 && (
//               <div className="d-flex justify-content-center align-items-center gap-3 mb-4">
//                 <button
//                   className="btn btn-sm btn-outline-secondary"
//                   onClick={() =>
//                     setCurrentPage((prev) => Math.max(prev - 1, 1))
//                   }
//                   disabled={currentPage === 1}
//                 >
//                   Previous
//                 </button>
//                 <span>
//                   Page {currentPage} of {totalPages}
//                 </span>
//                 <button
//                   className="btn btn-sm btn-outline-secondary"
//                   onClick={() =>
//                     setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//                   }
//                   disabled={currentPage === totalPages}
//                 >
//                   Next
//                 </button>
//               </div>
//             )}
//           </div>
//         )}

//         {downloadLogs && (
//           <div className="mt-4">
//             <h5>Download Logs</h5>
//             {downloadLogs.error && (
//               <div className="alert alert-danger">{downloadLogs.error}</div>
//             )}
//             {downloadLogs.success && (
//               <ul>
//                 {downloadLogs.success.map((log, idx) => (
//                   <li key={idx}>{log}</li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         )}
//       </div>
//     // {/* </Sidebar> */}
//   );
// }

// export default App;

// import React, { useState, useEffect } from "react";
// // import { BACKEND_URL } from "../../../services/Helper";
// import axios from "axios";
// import {
//   stateStationMap,
//   stateStationMap1,
//   stateStationMap2,
// } from "./stations";
// import { FileStatsChart, FilePieChart } from "./FileStatsChart";
// // import Sidebar from "../../layout/Sidebar";

// function App() {
//   let BACKEND_URL=`http://localhost:3001`
//   const [dataselect, SetDataSelect] = useState("");
//   const [hataRe2D, SetHatare2D] = useState("");
//   const [mainUrl, setMainUrl] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [jdsingle, SetJdSingle] = useState("");
//   const [singlemore, setSinglemore] = useState("");

//   const [selectedStates, setSelectedStates] = useState([]);
//   const [availableStations, setAvailableStations] = useState([]);
//   const [selectedStations, setSelectedStations] = useState([]);
//   const [formData, setFormData] = useState({
//     localDirectory: "",
//     startYear: "",
//     endYear: "",
//     startDate: "",
//     endDate: "",
//     stations: "",
//     mainUrl: "",
//   });

//   const [fileCheckResult, setFileCheckResult] = useState(null);
//   const [downloadLogs, setDownloadLogs] = useState(null);
//   const [checking, setChecking] = useState(false);
//   const [downloading, setDownloading] = useState(false);
//   const [fileCount, setFileCount] = useState("");

//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 12;

//   const indexOfLastRow = currentPage * rowsPerPage;
//   const indexOfFirstRow = indexOfLastRow - rowsPerPage;
//   const currentRows =
//     fileCheckResult && fileCheckResult.slice(indexOfFirstRow, indexOfLastRow);
//   const totalPages = fileCheckResult
//     ? Math.ceil(fileCheckResult.length / rowsPerPage)
//     : 0;

//   useEffect(() => {
//     let url = dataselect;
//     if (
//       dataselect === "Region 2 Hatanaka" ||
//       dataselect === "CORS_archive" ||
//       dataselect === "Region 2 Raw Data" ||
//       (dataselect === "Region_1_Hatanaka" && hataRe2D)
//     ) {
//       url += hataRe2D;
//     }
//     setMainUrl(url);
//   }, [dataselect, hataRe2D]);

//   useEffect(() => {
//     let mapToUse = stateStationMap;
//     if (
//       dataselect === "Region 1 Raw Data" ||
//       dataselect === "Region_1_Hatanaka"
//     ) {
//       mapToUse = stateStationMap1;
//     } else if (
//       dataselect === "Region 2 Raw Data" ||
//       dataselect === "Region 2 Hatanaka"
//     ) {
//       mapToUse = stateStationMap2;
//     }

//     const combinedStations = selectedStates.flatMap(
//       (state) => mapToUse[state] || []
//     );
//     setAvailableStations(combinedStations);
//     setSelectedStations([]);
//   }, [selectedStates, dataselect]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const payload = {
//     ...formData,
//     mainUrl,
//     startYearC: new Date(startDate).getFullYear(),
//     endYearC: new Date(endDate).getFullYear(),
//     startMonth: new Date(startDate).getMonth() + 1,
//     endMonth: new Date(endDate).getMonth() + 1,
//     startDay: new Date(startDate).getDate(),
//     endDay: new Date(endDate).getDate(),
//   };

//   const handleCheck = async (e) => {
//     e.preventDefault();
//     setChecking(true);
//     setFileCheckResult(null);
//     setDownloadLogs(null);
//     setCurrentPage(1);

//     try {
//       const response = await axios.post(
//         `${BACKEND_URL}/Ftp/api/check`,
//         payload
//       );
//       setFileCheckResult(response.data.files);
//       setFileCount(response.data.total);
//     } catch (err) {
//       setFileCheckResult([{ error: err.message }]);
//     } finally {
//       setChecking(false);
//     }
//   };

//   const handleDownload = async () => {
//   setDownloading(true);
//   setDownloadLogs(null);
//   try {
//     const response = await axios.post(`${BACKEND_URL}/Ftp/api/download`, {
//       userId: "dheeraj123", // Or dynamically get the userId from auth/session
//       localDirectory: formData.localDirectory,
//       files: fileCheckResult,
//     });

//     setDownloadLogs({
//       message: response.data.message,
//       queuePosition: response.data.queuePosition,
//       success: response.data.success, // optional, if backend sends download success logs
//     });
//   } catch (err) {
//     setDownloadLogs({ error: err.message });
//   } finally {
//     setDownloading(false);}
// };

// //   const handleDownload = async () => {
// //   setDownloading(true);
// //   setDownloadLogs(null);

// //   try {
// //     const response = await axios.post(
// //       `${BACKEND_URL}/Ftp/api/download`,
// //       {
// //         localDirectory: formData.localDirectory,
// //         files: fileCheckResult,
// //       },
// //       {
// //         responseType: "blob", 
// //       }
// //     );

// //     const blob = new Blob([response.data], { type: "application/zip" });
// //     const url = window.URL.createObjectURL(blob);
// //     const link = document.createElement("a");
// //     link.href = url;
// //     link.setAttribute("download", "FTP_Downloads.zip"); 
// //     document.body.appendChild(link);
// //     link.click();
// //     link.remove();
// //     window.URL.revokeObjectURL(url);

// //     setDownloadLogs({ success: "Download started." });
// //   } catch (err) {
// //     console.error("Download error:", err);
// //     setDownloadLogs({ error: err.message });
// //   } finally {
// //     setDownloading(false);
// //   }
// // };


//   // const handleDownload = async () => {
//   //   setDownloading(true);
//   //   setDownloadLogs(null);
//   //   try {
//   //     const response = await axios.post(`${BACKEND_URL}/Ftp/api/download`, {
//   //       localDirectory: formData.localDirectory,
//   //       files: fileCheckResult,
//   //     });
//   //     setDownloadLogs(response.data);
//   //   } catch (err) {
//   //     setDownloadLogs({ error: err.message });
//   //   } finally {
//   //     setDownloading(false);
//   //   }
//   // };
//   const getUniqueStations = (data) => {
//     const set = new Set();
//     data.forEach((item) => {
//       if (item.available && item.station) {
//         set.add(item.station);
//       }
//     });
//     return Array.from(set).sort();
//   };
//   const getDateStationMatrix = (data, stations) => {
//     const matrix = {};

//     data.forEach((item) => {
//       if (!item.date || !item.station) return;
//       if (!matrix[item.date]) {
//         matrix[item.date] = {};
//       }
//       matrix[item.date][item.station] = item.available;
//     });

//     return Object.entries(matrix).map(([date, availability]) => ({
//       date,
//       availability,
//     }));
//   };

//   return (
//     // <Sidebar>
//       <div
//         className="container mt-4"
//         style={{
//           backgroundColor: "whitesmoke",
//           padding: "10px",
//           borderRadius: "12px",
//         }}
//       >
//         <h2 className="text-center mb-4">FTP File Checker & Downloader</h2>
//         <form onSubmit={handleCheck} className="row g-3">
//           <div className="col-md-6">
//             <label className="form-label">Select Data Source</label>
//             <select
//               className="form-select"
//               required
//               onChange={(e) => SetDataSelect(e.target.value)}
//             >
//               <option value="">Select Source</option>
//               <option value="CORS_archive">CORS Archive</option>
//               <option value="Region 1 Raw Data">Region 1 Raw Data</option>
//               <option value="Region 2 Raw Data">Region 2 Raw Data</option>
//               <option value="Region_1_Hatanaka">Region_1_Hatanaka</option>
//               <option value="Region 2 Hatanaka">Region 2 Hatanaka</option>
//             </select>
//           </div>

//           <div className="col-md-6">
//             <label className="form-label">Data Selection Type</label>
//             <select
//               className="form-select"
//               required
//               onChange={(e) => SetJdSingle(e.target.value)}
//             >
//               <option>Select Type</option>
//               <option value="dateWise">Date Wise</option>
//               <option value="julianWise">Julian Date Wise</option>
//               <option value="singleDate">Single Date</option>
//             </select>
//           </div>

//           {(dataselect === "Region 2 Hatanaka" ||
//             dataselect === "Region_1_Hatanaka") && (
//             <div className="col-12">
//               <select
//                 className="form-select"
//                 required
//                 onChange={(e) => SetHatare2D(e.target.value)}
//               >
//                 <option value="">Select Format</option>
//                 <option value="/Daily">Daily</option>
//                 <option value="/Hourly">Hourly</option>
//               </select>
//             </div>
//           )}

//           {dataselect === "CORS_archive" && (
//             <div className="col-12">
//               <select
//                 required
//                 className="form-select"
//                 onChange={(e) => SetHatare2D(e.target.value)}
//               >
//                 <option value=''>Select Format</option>
//                 <option value="/RINEX_DAILY">Daily</option>
//                 <option value="/RINEX_Hourly">Hourly</option>
//               </select>
//             </div>
//           )}

//           {dataselect === "Region 2 Raw Data" && (
//             <div className="col-12">
//               <select
//                 className="form-select"
//                 required
//                 onChange={(e) => SetHatare2D(e.target.value)}
//               >
//                 <option value="">Select Format</option>
//                 <option value="/1HR">1HR</option>
//                 <option value="/24HR">24H</option>
//               </select>
//             </div>
//           )}
//           {jdsingle === "julianWise" && (
//             <>
//               <div className="col-md-6">
//                 <label className="form-label">Start Year</label>
//                 <input
//                   type="number"
//                   className="form-control"
//                   name="startYear"
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div className="col-md-6">
//                 <label className="form-label">End Year</label>
//                 <input
//                   type="number"
//                   className="form-control"
//                   name="endYear"
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//             </>
//           )}

//           {(jdsingle === "dateWise" || jdsingle === "singleDate") && (
//             <div className="col-md-6">
//               <label className="form-label">Start Date</label>
//               <input
//                 type="date"
//                 className="form-control"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//                 required
//               />
//             </div>
//           )}

//           {jdsingle === "dateWise" && (
//             <div className="col-md-6">
//               <label className="form-label">End Date</label>
//               <input
//                 type="date"
//                 className="form-control"
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//                 required
//               />
//             </div>
//           )}

//           {jdsingle === "julianWise" && (
//             <>
//               <div className="col-md-6">
//                 <label className="form-label">Start Julian Day</label>
//                 <input
//                   type="number"
//                   className="form-control"
//                   name="startDate"
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div className="col-md-6">
//                 <label className="form-label">End Julian Day</label>
//                 <input
//                   type="number"
//                   className="form-control"
//                   name="endDate"
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//             </>
//           )}

//           <div className="col-md-6">
//             <label className="form-label">Select State(s)</label>
//             <select
//               multiple
//               className="form-select"
//               required
//               value={selectedStates}
//               onChange={(e) => {
//                 const clickedOptions = Array.from(e.target.options)
//                   .filter((option) => option.selected)
//                   .map((option) => option.value);

//                 const lastClicked = e.target.value;
//                 setSelectedStates((prev) => {
//                   if (prev.includes(lastClicked)) {
//                     return prev.filter((state) => state !== lastClicked);
//                   } else {
//                     return [...prev, lastClicked];
//                   }
//                 });
//               }}
//             >
//               <option disabled>-- Select State --</option>
//               {Object.keys(
//                 dataselect === "Region 1 Raw Data" ||
//                   dataselect === "Region_1_Hatanaka"
//                   ? stateStationMap1
//                   : dataselect === "Region 2 Raw Data" ||
//                     dataselect === "Region 2 Hatanaka"
//                   ? stateStationMap2
//                   : stateStationMap
//               ).map((state) => (
//                 <option key={state} value={state}>
//                   {state}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {availableStations.length > 0 && (
//             <div className="col-md-6">
//               <label className="form-label">Select Stations</label>
//               <select
//                 multiple
//                 className="form-select"
//                 value={selectedStations}
//                 onChange={(e) => {
//                   const selectedCodes = Array.from(
//                     e.target.selectedOptions,
//                     (opt) => opt.value
//                   );
//                   const merged = Array.from(
//                     new Set([...selectedStations, ...selectedCodes])
//                   );
//                   setSelectedStations(merged);
//                   setFormData((prev) => ({
//                     ...prev,
//                     stations: merged.join(" "),
//                   }));
//                 }}
//               >
//                 {availableStations.map((station) => (
//                   <option key={station.code} value={station.code}>
//                     {station.name} ({station.code})
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}

//           <div className="col-md-6">
//             <label className="form-label">Local Directory</label>
//             <input
//               type="text"
//               className="form-control"
//               name="localDirectory"
//               onChange={handleChange}
//               placeholder="Leave empty for default"
//             />
//           </div>

//           <div className="col-md-6">
//             <label className="form-label">Stations (space-separated)</label>
//             <textarea
//               className="form-control"
//               rows="2"
//               name="stations"
//               value={formData.stations}
//               onChange={(e) => {
//                 const inputValue = e.target.value.toUpperCase();
//                 const stationArray = inputValue
//                   .split(" ")
//                   .map((s) => s.trim())
//                   .filter(Boolean);
//                 setFormData((prev) => ({
//                   ...prev,
//                   stations: stationArray.join(" "),
//                 }));
//                 setSelectedStations(stationArray);
//               }}
//               required
//             />
//           </div>

//           <div className="col-12 d-flex justify-content-center gap-3 mt-3">
//             <button type="submit" className="btn btn-info" disabled={checking}>
//               {checking ? "Checking..." : "Check File Availability"}
//             </button>

//             {fileCheckResult && (
//               <button
//                 className="btn btn-primary"
//                 onClick={handleDownload}
//                 disabled={downloading}
//               >
//                 {downloading ? "Downloading..." : "Download Files"}
//               </button>
//             )}
//           </div>
//         </form>

//         {fileCheckResult && (
//           <div className="mt-5">
//             <div className="row align-items-center">
//               <div className="col-md-6">
//                 <FilePieChart fileCount={fileCount} />
//               </div>
//               <div className="col-md-6">
//                 <h5 className="mt-4">File Availability</h5>
//                 <ul>
//                   <li>
//                     Total: <strong>{fileCount.totalChecked}</strong>
//                   </li>
//                   <li>
//                     Available: <strong>{fileCount.totalAvailable}</strong>
//                   </li>
//                   <li>
//                     Missing: <strong>{fileCount.totalMissing}</strong>
//                   </li>
//                 </ul>
//               </div>
//             </div>

//             <FileStatsChart fileData={fileCheckResult} />

//             {/* {fileCheckResult && (
//               <div className="mt-5">
//                 <h5>Station Availability Matrix</h5>
//                 <div className="table-responsive">
//                   <table className="table table-bordered table-striped">
//                     <thead>
//                       <tr>
//                         <th>Date</th>
//                         {getUniqueStations(fileCheckResult).map((station) => (
//                           <th key={station}>{station}</th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {getDateStationMatrix(
//                         fileCheckResult,
//                         getUniqueStations(fileCheckResult)
//                       ).map((row, idx) => (
//                         <tr key={idx}>
//                           <td>{row.date}</td>
//                           {getUniqueStations(fileCheckResult).map((station) => (
//                             <td key={station} className="text-center">
//                               {row.availability[station] ? "Available" : "Misssing"}
//                             </td>
//                           ))}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )} */}
//             {fileCheckResult && (
//               <div className="mt-5">
//                 <h5> Station Availability Matrix</h5>

//                 <div
//                   style={{
//                     maxHeight: "500px",
//                     overflowY: "auto",
//                     overflowX: "auto",
//                     border: "1px solid #ddd",
//                     borderRadius: "6px",
//                   }}
//                 >
//                   <table className="table table-bordered table-striped mb-0">
//                     <thead>
//                       <tr>
//                         <th
//                           style={{
//                             position: "sticky",
//                             left: 0,
//                             background: "#fff",
//                             zIndex: 1,
//                           }}
//                         >
//                           Date
//                         </th>
//                         {getUniqueStations(fileCheckResult).map((station) => (
//                           <th key={station}>{station}</th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {getDateStationMatrix(
//                         fileCheckResult,
//                         getUniqueStations(fileCheckResult)
//                       ).map((row, idx) => (
//                         <tr key={idx}>
//                           <td
//                             style={{
//                               position: "sticky",
//                               left: 0,
//                               background: "#f9f9f9",
//                               zIndex: 1,
//                             }}
//                           >
//                             {row.date}
//                           </td>
//                           {getUniqueStations(fileCheckResult).map((station) => (
//                             <td key={station} className="text-center">
//                               {row.availability[station] ? "Y" : "N"}
//                             </td>
//                           ))}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}

//             <table className="table table-bordered mt-4">
//               <thead>
//                 <tr>
//                   <th>Date</th>
//                   <th>Station</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentRows.map((file, idx) => (
//                   <tr key={idx}>
//                     {file.error ? (
//                       <td colSpan="3" className="text-danger fw-bold">
//                         {file.error}
//                       </td>
//                     ) : (
//                       <>
//                         <td>{file.date}</td>
//                         <td>{file.station}</td>
//                         <td
//                           className={
//                             file.available ? "text-success" : "text-warning"
//                           }
//                         >
//                           <strong>
//                             {file.available ? "Available" : "Missing"}
//                           </strong>
//                         </td>
//                       </>
//                     )}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {totalPages > 1 && (
//               <div className="d-flex justify-content-center align-items-center gap-3 mb-4">
//                 <button
//                   className="btn btn-sm btn-outline-secondary"
//                   onClick={() =>
//                     setCurrentPage((prev) => Math.max(prev - 1, 1))
//                   }
//                   disabled={currentPage === 1}
//                 >
//                   Previous
//                 </button>
//                 <span>
//                   Page {currentPage} of {totalPages}
//                 </span>
//                 <button
//                   className="btn btn-sm btn-outline-secondary"
//                   onClick={() =>
//                     setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//                   }
//                   disabled={currentPage === totalPages}
//                 >
//                   Next
//                 </button>
//               </div>
//             )}
//           </div>
//         )}

//         {downloadLogs && (
//   <div className="mt-4">
//     <h5>Download Status</h5>

//     {downloadLogs.error && (
//       <div className="alert alert-danger">{downloadLogs.error}</div>
//     )}

//     {downloadLogs.message && (
//       <div className="alert alert-success">
//         <p>{downloadLogs.message}</p>
//         <p>
//           <strong>Queue Position:</strong> {downloadLogs.queuePosition}
//         </p>
//       </div>
//     )}

//     {downloadLogs.success && Array.isArray(downloadLogs.success) && (
//       <div className="mt-3">
//         <h6>Download Logs</h6>
//         <ul>
//           {downloadLogs.success.map((log, idx) => (
//             <li key={idx}>{log}</li>
//           ))}
//         </ul>
//       </div>
//   )}
// </div>
// )}

//         {/* {downloadLogs && (
//           <div className="mt-4">
//             <h5>Download Logs</h5>
//             {downloadLogs.error && (
//               <div className="alert alert-danger">{downloadLogs.error}</div>
//             )}
//             {downloadLogs.success && (
//               <ul>
//                 {downloadLogs.success.map((log, idx) => (
//                   <li key={idx}>{log}</li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         )} */}
//       </div>
//     // </Sidebar>
//   );
// }

// export default App;


