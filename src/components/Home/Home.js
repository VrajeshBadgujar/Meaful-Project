import React, { useEffect, useState } from "react";
import MealData from "../Data/data.json";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Home.css";
import Modal from "react-modal";

import {
  LineChart,
  BarChart,
  Bar,
  ResponsiveContainer,
  Legend,
  Tooltip,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function Home(props) {
  const [userData, setUserData] = useState([]);
  const [itemdate, setitemdate] = useState("");
  const datemap = new Map();
  const schdatemap = new Map();
  const [pData, setpData] = useState([]);
  const [tdata, settdata] = useState([]);
  const [schdate, setschdate] = useState("");
  const [date, setDate] = useState(new Date());
  const [schobj, setschobj] = useState({});

  const [date1, setdate1] = useState(new Date());
  const [date2, setdate2] = useState(new Date());
  const [formdate1, formsetdate1] = useState("");
  const [formdate2, formsetdate2] = useState("");

 
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };
  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
  }

 
   
   
    
  

  const handleChange = (event) => {
    setitemdate(event.target.value);
    setUserData([]);
    setschobj({});
  };
  const handleChange_date1 = (event) => {
    setitemdate(event.target.value);
    setUserData([]);
    setschobj({});
  };
  const handleChange_date2 = (event) => {
    setitemdate(event.target.value);
    setUserData([]);
    setschobj({});
  };

  

  const convert = (str1) => {
    var mnths = {
        Jan: "01",
        Feb: "02",
        Mar: "03",
        Apr: "04",
        May: "05",
        Jun: "06",
        Jul: "07",
        Aug: "08",
        Sep: "09",
        Oct: "10",
        Nov: "11",
        Dec: "12",
      },
      v = str1.toString().split(" ");

    return [v[3], mnths[v[1]], v[2]].join("-");
  };

  // const datechange=(val)=>{
  //     // var dd=convert(val);
  //     // console.log(dd);
  //     setitemdate(val);
  // }

  const dateview = (event) => {
    console.log(event.value);
    setschdate(event.value);

    var day = event.value;
    console.log(schobj);
    var times = schobj[day];
    console.log(times);

    var ff = [];

    ff.push({ timelimit: "0-6", frq: times[0] });
    ff.push({ timelimit: "6-12", frq: times[1] });
    ff.push({ timelimit: "12-18", frq: times[2] });
    ff.push({ timelimit: "18-24", frq: times[3] });

    settdata(ff);

    console.log("***********");
  };

  const handleSubmit_2dates = (event) => {
    event.preventDefault();

    var dd_1 = convert(date1);
    formsetdate1(dd_1);

    var dd_2 = convert(date2);
    formsetdate2(dd_2);

    console.log((date2 - date1) / 86400000);
    var days = [];
    var dateloop = date1;
    if (date2 > date1) {
      for (let i = 0; i < (date2 - date1) / 86400000 + 1; i++) {
        days.push(convert(dateloop));
        var tomorrow = new Date(dateloop);
        tomorrow.setDate(dateloop.getDate() + 1);
        dateloop = tomorrow;
      }
      console.log(days);
      var total = 0;
      var gg = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (let j = 0; j < days.length; j++) {
        MealData.map((mealdetails, index) => {
          if (mealdetails.item_date == days[j]) {
            total += 1;
            var s = mealdetails.schedule_time.split(" ");
            var d1 = new Date(mealdetails.item_date);
            var d2 = new Date(s[0]);
            var prior_days = (d1 - d2) / 86400000;
            console.log("################");
            console.log(d2);
            console.log(d1);
            console.log(prior_days);
            gg[prior_days] += 1;
            console.log("################");
          }
        });
      }

      console.log(gg);
      console.log(total);
      var df = [
        { title: "Zero", value: 0 },
        { title: "One", value: 0 },
        { title: "Two", value: 0 },
        { title: "Three", value: 0 },
        { title: "Four", value: 0 },
        { title: "Five", value: 0 },
        { title: "Six", value: 0 },
        { title: "Seven", value: 0 },
        { title: "Eight", value: 0 },
        { title: "Nine", value: 0 },
      ];
      for (let j = 0; j < 10; j++) {
        df[j].value = gg[j];
      }
      console.log(df);

      ;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    var dd = convert(date);
    console.log(dd);
    setitemdate(dd);

    setschobj({});
    datemap.clear();
    var d = [];

    MealData.map((mealdetails, index) => {
      if (mealdetails.item_date == itemdate || mealdetails.item_date == dd) {
        var s = mealdetails.schedule_time.split(" ");
        d.push({ day: s, slot: mealdetails.slot });
        if (datemap.has(s[0])) {
          var count = datemap.get(s[0]);
          datemap.set(s[0], count + 1);
          var arrdata = schdatemap.get(s[0]);
          arrdata.push(s[1]);
          schdatemap.set(s[0], arrdata);
        } else {
          datemap.set(s[0], 1);
          var a = [];
          a.push(s[1]);
          schdatemap.set(s[0], a);
        }
      }
    });

    setUserData(d);
    console.log(schdatemap.size);

    schdatemap.forEach((v, k) => {
      var arrtime = [0, 0, 0, 0];
      v.forEach((a, b) => {
        console.log(k + " " + a);
        console.log(a[0] + a[1] > 9);
        if (a[0] + a[1] >= 0 && a[0] + a[1] < 6) {
          arrtime[0] += 1;
        } else if (a[0] + a[1] >= 6 && a[0] + a[1] < 12) {
          arrtime[1] += 1;
        } else if (a[0] + a[1] >= 12 && a[0] + a[1] < 18) {
          arrtime[2] += 1;
        } else {
          arrtime[3] += 1;
        }
      });
      console.log(k + " " + arrtime);
      var h = schobj;
      h[k] = arrtime;
      setschobj(h);
    });

    var ldata = [];
    datemap.forEach((v, k) => {
      //console.log(k+" "+v);
      ldata.push({ date: k, orders: v });
    });

    setpData(ldata);

    //console.log(userData);
  };

  function customizeText(arg) {
    return `${arg.valueText} (${arg.percentText})`;
  }

  return (
    <div className="main-container">

<div className="linechart-container" style={{ height: 10 }}>
        <img
          className="img"
          src="https://www.mealful.ca/mealfulWebAssets/img/mealful-22.svg"
          alt="new"
        />
      </div> 
      
      <div className="Nav_Bar">
        <div className="nav_title">
          mealful Project
        </div>
        <div>
          <button onClick={openModal}>Instructions</button>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Instructions</h2>
        <div>For Graph1:</div>
        <div>Select the relevant date to view scheduled distribution</div>
        <div>(Try between 2021-05-19 and 2022-01-05)</div>
        <div>
          In the First Line Chart select the Date label on X axix to view its
          Time distribution in Line Chart 2
        </div>
        <div>For PieChart distribution:(Bonus Task)</div>
        <div>Select relevant dates</div>
        <div>
          In the legend, 0 means scheduled and item date are same, 1 means order
          scheduled 1 day before item_date
        </div>
        <div>
          And yes, click submit button to view results in both Graph1 and
          PieChart
        </div>
        <button onClick={closeModal}>close</button>
      </Modal>

      <div className="date_form">
        <form onSubmit={handleSubmit}>
          <label>
            <span className="date_text">Date:</span>

            <input
              type="text"
              value={itemdate}
              onChange={handleChange}
              className="date_input"
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>

      <div style={{ margin: 10 }}>
        <Calendar
          className="calender-container_1"
          onChange={setDate}
          value={date}
        />
      </div>
      
     
      <div className="linechart-container">
        
        <h1 className="text-heading">Scheduling Distribution:</h1>
        <ResponsiveContainer width="100%" aspect="3">
          <LineChart
            data={pData}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <CartesianGrid />
            <XAxis
              onClick={dateview}
              dataKey="date"
              interval={"preserveStartEnd"}
            />
            <YAxis></YAxis>
            <Legend />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="orders"
              activeDot={{ r: 8 }}
              stroke="red"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="linechart-container">
        <h1 className="text-heading">Time Distribution: {schdate}</h1>
        <ResponsiveContainer width="100%" aspect="3">
          <BarChart
            data={tdata}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <Bar dataKey="frq" fill="#CD5C5C" />
            <Tooltip />
            <XAxis dataKey="timelimit" />
            <YAxis />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
    </div>
  );
}

export default Home;
