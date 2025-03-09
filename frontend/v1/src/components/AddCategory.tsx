import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "../components/ui/drawer"
import { ChevronRight } from 'lucide-react';
import { Badge } from "../components/ui/badge";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";

import { useState } from "react";


const AddCategory = () => {
    const [activeCategories, setActiveCategories] = useState<string[]>([]);

    const handleClick = (category: string) => {
        setActiveCategories((prev) =>
        prev.includes(category)
            ? prev.filter((c) => c !== category) // Remove if already selected
            : [...prev, category] // Add if not selected
        )
    }

    const categoriesData = [
        { name: "exercise" },
        { name: "study" },
        { name: "work" },
        { name: "office"},
        { name: "dinner"},
        { name: "breakfast"},
        { name: "lunch"},
        { name: "running"},
        { name: "yoga"},
    ]

  return (
    <>
        <Drawer>
              <DrawerTrigger>
                <div className="flex items-center justify-between p-2 border rounded">
                  <Label htmlFor="title" className="text-right">
                    AddCategory
                  </Label>

                  <ChevronRight />
                </div>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Select your Categories</DrawerTitle>
                  <DrawerDescription/>
                </DrawerHeader>

                <div className="[&>*]:mr-2 m-2">
                {categoriesData.map((category)=> (
                  <Badge
                  key={category.name}
                  variant={activeCategories.includes(category.name) ? "default" : "outline"} // Change variant dynamically
                  onClick={() => handleClick(category.name)}
                  className="cursor-pointer" // Add pointer cursor for better UX
                >{category.name}</Badge>
                ))
                }
                </div>

                <DrawerFooter>
                <DrawerClose className="">
                  <Button>Add</Button>
                </DrawerClose> 
                </DrawerFooter>
              </DrawerContent>
              </Drawer>

              {activeCategories && activeCategories.length > 0 &&
                <div className="[&>*]:mr-2">
                  { activeCategories.map((category) => (<Badge>{category}</Badge>))}
                </div>
              }
    </>
  )
}

export default AddCategory