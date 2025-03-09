import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

const monthNames = [
  { value: "january", label: "January" },
  { value: "february", label: "February" },
  { value: "march", label: "March" },
  { value: "april", label: "April" },
  { value: "may", label: "May" },
  { value: "june", label: "June" },
  { value: "july", label: "July" },
  { value: "august", label: "August" },
  { value: "september", label: "September" },
  { value: "october", label: "October" },
  { value: "november", label: "November" },
  { value: "december", label: "December" },
]

const date = new Date()
const monthObject = monthNames[date.getMonth()]
const monthName = monthObject.value

export function Combobox({ onSelect }) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(monthName)

  const handleSelection = (selectedItems) => {
    console.log(selectedItems)
    setValue(selectedItems)
    onSelect(selectedItems)
    setOpen(false)
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? monthNames.find((monthName) => monthName.value === value)?.label
            : "Starting from"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <Command>
          <CommandInput placeholder="Search monthName..." className="h-9" />
          <CommandList>
            <CommandEmpty>No monthName found.</CommandEmpty>
            <CommandGroup>
              {monthNames.map((monthName) => (
                <CommandItem
                  key={monthName.value}
                  value={monthName.value}
                  onSelect={(currentValue) => {
                    handleSelection(currentValue)
                    setOpen(false)
                  }}
                >
                  {monthName.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === monthName.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DrawerContent>
    </Drawer>
  )
}
