import { z } from "zod"
import { ObjectId } from "bson"

/*

Ska funkera tvärtemot Tasks.

I tasks så länkar man en task till en aktivitet

I resurserna ska man bara skapa upp dom. Sen i kurser eller projekt
så kan man länka till en specifik resurs

1 - 1 förhållande eller 1-0
task -> activity

flera - 1  eller 0 - 1
activities => resurs

title
type: enum av olika slag
kolllad till en activity
   activityName: z.string().default(""),
  activityId: z.string().default(""),
  activityGroup: z.string().default(""),
 link: string eller tom


*/
