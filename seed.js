const { MongoClient } = require('mongodb');
const d = s => new Date(s);

const data = {
  neighborhoods: [
    { _id: "NB01", name: "Kawempe Central", division: "Kawempe", households: 5200, zone: "A" },
    { _id: "NB02", name: "Ntinda Heights", division: "Nakawa", households: 3800, zone: "B" },
    { _id: "NB03", name: "Makindye West", division: "Makindye", households: 4600, zone: "C" },
    { _id: "NB04", name: "Rubaga Hill", division: "Rubaga", households: 4100, zone: "D" },
    { _id: "NB05", name: "Kira Town", division: "Kira", households: 6100, zone: "E" }
  ],
  residents: [
    { _id: "R001", full_name: "Aisha Nakato", phone: "+256700111001", email: "aisha@mail.com", neighborhood_id: "NB01", street: "Market Street", household_size: 5, notifications: true, registered_on: d("2026-01-12") },
    { _id: "R002", full_name: "Brian Okello", phone: "+256700111002", email: "brian@mail.com", neighborhood_id: "NB02", street: "Acacia Road", household_size: 3, notifications: true, registered_on: d("2026-02-03") },
    { _id: "R003", full_name: "Grace Namutebi", phone: "+256700111003", email: "grace@mail.com", neighborhood_id: "NB03", street: "Lake View Lane", household_size: 6, notifications: false, registered_on: d("2026-02-20") },
    { _id: "R004", full_name: "David Ssemakula", phone: "+256700111004", email: "david@mail.com", neighborhood_id: "NB04", street: "Hill Crescent", household_size: 4, notifications: true, registered_on: d("2026-03-08") },
    { _id: "R005", full_name: "Sarah Atim", phone: "+256700111005", email: "sarah@mail.com", neighborhood_id: "NB05", street: "Station Road", household_size: 2, notifications: true, registered_on: d("2026-03-30") }
  ],
  trucks: [
    { _id: "TR01", plate: "UBF 214K", type: "Compactor", capacity_tons: 8, driver_name: "Moses Kato", status: "Active" },
    { _id: "TR02", plate: "UBG 530M", type: "Tipper", capacity_tons: 6, driver_name: "Joseph Wasswa", status: "Active" },
    { _id: "TR03", plate: "UBA 077P", type: "Compactor", capacity_tons: 10, driver_name: "Peter Mugisha", status: "Under Maintenance" },
    { _id: "TR04", plate: "UBH 318R", type: "Skip Loader", capacity_tons: 5, driver_name: "Hassan Lubega", status: "Active" },
    { _id: "TR05", plate: "UBE 941T", type: "Tipper", capacity_tons: 7, driver_name: "Ruth Nabirye", status: "Active" }
  ],
  pickup_schedules: [
    { _id: "SC01", neighborhood_id: "NB01", truck_id: "TR01", day: "Monday", time_window: "06:00-09:00", waste_type: "General", status: "Completed", last_collected: d("2026-10-12") },
    { _id: "SC02", neighborhood_id: "NB02", truck_id: "TR02", day: "Tuesday", time_window: "06:00-09:00", waste_type: "General", status: "Scheduled", last_collected: d("2026-10-06") },
    { _id: "SC03", neighborhood_id: "NB03", truck_id: "TR03", day: "Wednesday", time_window: "07:00-10:00", waste_type: "Recyclable", status: "Delayed", last_collected: d("2026-09-30") },
    { _id: "SC04", neighborhood_id: "NB04", truck_id: "TR04", day: "Thursday", time_window: "06:00-09:00", waste_type: "General", status: "Scheduled", last_collected: d("2026-10-08") },
    { _id: "SC05", neighborhood_id: "NB05", truck_id: "TR05", day: "Friday", time_window: "08:00-11:00", waste_type: "General", status: "Scheduled", last_collected: d("2026-10-09") }
  ],
  issue_reports: [
    { _id: "IS01", resident_id: "R001", neighborhood_id: "NB01", issue_type: "Missed pickup", description: "Truck skipped Market Street", street: "Market Street", priority: "High", status: "Open", reported_at: d("2026-10-05"), resolved_at: null },
    { _id: "IS02", resident_id: "R002", neighborhood_id: "NB02", issue_type: "Overflowing bin", description: "Public bin full for 4 days", street: "Acacia Road", priority: "Medium", status: "In Progress", reported_at: d("2026-10-07"), resolved_at: null },
    { _id: "IS03", resident_id: "R003", neighborhood_id: "NB03", issue_type: "Illegal dumping", description: "Waste dumped near drainage", street: "Lake View Lane", priority: "Medium", status: "Open", reported_at: d("2026-10-08"), resolved_at: null },
    { _id: "IS04", resident_id: "R004", neighborhood_id: "NB04", issue_type: "Missed pickup", description: "No collection last Thursday", street: "Hill Crescent", priority: "Low", status: "Resolved", reported_at: d("2026-09-28"), resolved_at: d("2026-09-30") },
    { _id: "IS05", resident_id: "R005", neighborhood_id: "NB05", issue_type: "Overflowing bin", description: "Market bin overflowing onto road", street: "Station Road", priority: "High", status: "Open", reported_at: d("2026-10-10"), resolved_at: null },
    { _id: "IS06", resident_id: "R001", neighborhood_id: "NB01", issue_type: "Overflowing bin", description: "Bin broken and spilling", street: "Market Street", priority: "Medium", status: "Resolved", reported_at: d("2026-09-20"), resolved_at: d("2026-09-22") }
  ]
};

(async () => {
  const client = new MongoClient('mongodb://127.0.0.1:27017');
  await client.connect();
  const db = client.db('waste_management_db');
  for (const [name, docs] of Object.entries(data)) {
    await db.collection(name).deleteMany({});
    await db.collection(name).insertMany(docs);
    console.log(`${name}: ${docs.length} documents inserted`);
  }
  await client.close();
})();