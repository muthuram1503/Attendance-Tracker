const mongoose = require("mongoose");
const Attendance = require("./models/student"); // adjust path as needed

// Replace with your actual MongoDB database name
const dbName = "studentData";
const MONGO_URI = "mongodb+srv://muthuramS:muthuram15032005@cluster0.hkf9z.mongodb.net/studentData";

mongoose.connect(MONGO_URI , {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log("MongoDB connection error:", err));

Attendance.insertMany([
  { "name": "MARIA ANNALIA DHAS.Y", "RegNo": "950022104001", "dept": "cse", "year": 3 },
  { "name": "ESAKKIAMMAL M", "RegNo": "950022104002", "dept": "cse", "year": 3 },
  { "name": "SYLVIA GLAARIS D", "RegNo": "950022104003", "dept": "cse", "year": 3 },
  { "name": "FRANISHA MERLIN F V", "RegNo": "950022104004", "dept": "cse", "year": 3 },
  { "name": "MOHAMMED ATHIF. S", "RegNo": "950022104005", "dept": "cse", "year": 3 },
  { "name": "DESOFFER S", "RegNo": "950022104006", "dept": "cse", "year": 3 },
  { "name": "INDRA E", "RegNo": "950022104007", "dept": "cse", "year": 3 },
  { "name": "ANNS LINISHA L", "RegNo": "950022104008", "dept": "cse", "year": 3 },
  { "name": "JAMES JEBA BIGSON E", "RegNo": "950022104009", "dept": "cse", "year": 3 },
  { "name": "ANBU PRIYA M", "RegNo": "950022104010", "dept": "cse", "year": 3 },
  { "name": "TAMILMURASU D", "RegNo": "950022104011", "dept": "cse", "year": 3 },
  { "name": "ARVIND A", "RegNo": "950022104012", "dept": "cse", "year": 3 },
  { "name": "MATHAN P", "RegNo": "950022104013", "dept": "cse", "year": 3 },
  { "name": "KAJA MYDEEN HALIK S", "RegNo": "950022104014", "dept": "cse", "year": 3 },
  { "name": "HARIBALAJI H", "RegNo": "950022104016", "dept": "cse", "year": 3 },
  { "name": "MUTHURAM S", "RegNo": "950022104017", "dept": "cse", "year": 3 },
  { "name": "SIVA N", "RegNo": "950022104018", "dept": "cse", "year": 3 },
  { "name": "VINOTHA P", "RegNo": "950022104019", "dept": "cse", "year": 3 },
  { "name": "BUVANA S", "RegNo": "950022104020", "dept": "cse", "year": 3 },
  { "name": "REX CLEMENT D", "RegNo": "950022104021", "dept": "cse", "year": 3 },
  { "name": "PRIYA M", "RegNo": "950022104022", "dept": "cse", "year": 3 },
  { "name": "MUTHUSELVI S", "RegNo": "950022104024", "dept": "cse", "year": 3 },
  { "name": "SILVIYA GRACE S", "RegNo": "950022104025", "dept": "cse", "year": 3 },
  { "name": "SREE NIDHI M", "RegNo": "950022104027", "dept": "cse", "year": 3 },
  { "name": "JINOLIN K V", "RegNo": "950022104029", "dept": "cse", "year": 3 },
  { "name": "MOHANA D", "RegNo": "950022104030", "dept": "cse", "year": 3 },
  { "name": "AFNAN AHMED S K", "RegNo": "950022104031", "dept": "cse", "year": 3 },
  { "name": "RAJHAGOPAL S", "RegNo": "950022104032", "dept": "cse", "year": 3 },
  { "name": "MADHUMITHA S", "RegNo": "950022104035", "dept": "cse", "year": 3 },
  { "name": "ARUN KARTHICK SHANKAR G", "RegNo": "950022104036", "dept": "cse", "year": 3 },
  { "name": "GOKUL SUDHARAM S", "RegNo": "950022104037", "dept": "cse", "year": 3 },
  { "name": "SAFIYULLAH H", "RegNo": "950022104039", "dept": "cse", "year": 3 },
  { "name": "ARAVIND R", "RegNo": "950022104040", "dept": "cse", "year": 3 },
  { "name": "NICKSHITHA", "RegNo": "950022104041", "dept": "cse", "year": 3 },
  { "name": "ABINAYA S", "RegNo": "950022104042", "dept": "cse", "year": 3 },
  { "name": "VANITHA P", "RegNo": "950022104043", "dept": "cse", "year": 3 },
  { "name": "GEETHA S", "RegNo": "950022104044", "dept": "cse", "year": 3 },
  { "name": "DHIVAGHAR V B", "RegNo": "950022104046", "dept": "cse", "year": 3 },
  { "name": "JANANI T", "RegNo": "950022104047", "dept": "cse", "year": 3 },
  { "name": "HARISHKUMAR V", "RegNo": "950022104048", "dept": "cse", "year": 3 },
  { "name": "BENEDICT MARIA L", "RegNo": "950022104049", "dept": "cse", "year": 3 },
  { "name": "MAHAKANNIPETCHI M", "RegNo": "950022104050", "dept": "cse", "year": 3 },
  { "name": "KASHNIGA N", "RegNo": "950022104051", "dept": "cse", "year": 3 },
  { "name": "HARIHARAN M", "RegNo": "950022104052", "dept": "cse", "year": 3 },
  { "name": "MERLIN S", "RegNo": "950022104053", "dept": "cse", "year": 3 },
  { "name": "SIDDHARTHA D", "RegNo": "950022104054", "dept": "cse", "year": 3 },
  { "name": "ARUL SELVI B", "RegNo": "950022104055", "dept": "cse", "year": 3 },
  { "name": "GOUTHAM M", "RegNo": "950022104056", "dept": "cse", "year": 3 },
  { "name": "ALEXSANDER K", "RegNo": "950022104057", "dept": "cse", "year": 3 },
  { "name": "LELIN ROCH R", "RegNo": "950022104301", "dept": "cse", "year": 3 },
  { "name": "KOMBAIYA @GOPI V", "RegNo": "950022104303", "dept": "cse", "year": 3 },
  { "name": "ABILASH KANNAN S J", "RegNo": "950022104701", "dept": "cse", "year": 3 },
  { "name": "BLESSING KINGSLEY V", "RegNo": "950022104703", "dept": "cse", "year": 3 }
])

.then(() => {
  console.log("Sample attendance data inserted successfully.");
  mongoose.disconnect();
})
.catch((err) => {
  console.error("Error inserting attendance data:", err);
  mongoose.disconnect();
});

