onRecordCreate((e) => {
  if (!e.record.get("role")) {
    e.record.set("role", "client");
  }
  e.next();
}, "users");