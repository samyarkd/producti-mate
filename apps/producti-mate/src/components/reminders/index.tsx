/**
 * This is the main component of the Reminders List.
 * Reminders list is a table and a form to add new reminders.
 */

import type { ReminderList } from "@pm/types"
import AddReminder from "./add-reminder"
import RemindersTable from "./reminders-table"

function Reminders(props: ReminderList) {
  return (
    <div className="flex flex-col gap-4">
      <RemindersTable
        items={props.items}
        onEdit={props.onEdit}
        onDelete={props.onDelete}
      />

      <AddReminder onAdd={props.onAdd} />
    </div>
  )
}

export default Reminders
