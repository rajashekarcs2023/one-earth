"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { MapPin, Locate, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface LocationFilterProps {
  onLocationChange: (location: string | null) => void
  currentLocation: string | null
}

export default function LocationFilter({ onLocationChange, currentLocation }: LocationFilterProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  // Mock location data - in a real app, this would come from a geolocation API
  const locations = {
    countries: [
      { id: "us", name: "United States" },
      { id: "ca", name: "Canada" },
      { id: "uk", name: "United Kingdom" },
    ],
    states: [
      { id: "ny", name: "New York", country: "us" },
      { id: "ca", name: "California", country: "us" },
      { id: "fl", name: "Florida", country: "us" },
      { id: "tx", name: "Texas", country: "us" },
      { id: "on", name: "Ontario", country: "ca" },
      { id: "bc", name: "British Columbia", country: "ca" },
    ],
    cities: [
      { id: "nyc", name: "New York City", state: "ny" },
      { id: "bk", name: "Brooklyn", state: "ny" },
      { id: "sf", name: "San Francisco", state: "ca" },
      { id: "la", name: "Los Angeles", state: "ca" },
      { id: "mi", name: "Miami", state: "fl" },
      { id: "au", name: "Austin", state: "tx" },
      { id: "to", name: "Toronto", state: "on" },
      { id: "va", name: "Vancouver", state: "bc" },
    ],
  }

  // Filter locations based on search term
  const filteredLocations = {
    countries: locations.countries.filter((country) => country.name.toLowerCase().includes(searchTerm.toLowerCase())),
    states: locations.states.filter((state) => state.name.toLowerCase().includes(searchTerm.toLowerCase())),
    cities: locations.cities.filter((city) => city.name.toLowerCase().includes(searchTerm.toLowerCase())),
  }

  const handleLocateMe = () => {
    // In a real app, this would use the browser's geolocation API
    toast({
      title: "Locating you...",
      description: "Using your current location",
    })

    // Simulate getting the user's location
    setTimeout(() => {
      onLocationChange("Brooklyn, NY")
      setOpen(false)
      toast({
        title: "Location set",
        description: "Showing reports near Brooklyn, NY",
      })
    }, 1000)
  }

  const clearLocation = () => {
    onLocationChange(null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1 pr-2">
          <MapPin className="h-4 w-4" />
          <span className="truncate max-w-[120px]">{currentLocation || "All Locations"}</span>
          {currentLocation && (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 ml-1 p-0"
              onClick={(e) => {
                e.stopPropagation()
                clearLocation()
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Location</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <Button variant="outline" className="w-full flex justify-start gap-2" onClick={handleLocateMe}>
            <Locate className="h-4 w-4" />
            Use my current location
          </Button>

          <Command>
            <CommandInput placeholder="Search locations..." value={searchTerm} onValueChange={setSearchTerm} />
            <CommandList>
              <CommandEmpty>No locations found</CommandEmpty>

              {filteredLocations.countries.length > 0 && (
                <CommandGroup heading="Countries">
                  {filteredLocations.countries.map((country) => (
                    <CommandItem
                      key={country.id}
                      onSelect={() => {
                        onLocationChange(country.name)
                        setOpen(false)
                      }}
                    >
                      {country.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {filteredLocations.states.length > 0 && (
                <CommandGroup heading="States">
                  {filteredLocations.states.map((state) => (
                    <CommandItem
                      key={state.id}
                      onSelect={() => {
                        onLocationChange(state.name)
                        setOpen(false)
                      }}
                    >
                      {state.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {filteredLocations.cities.length > 0 && (
                <CommandGroup heading="Cities">
                  {filteredLocations.cities.map((city) => (
                    <CommandItem
                      key={city.id}
                      onSelect={() => {
                        onLocationChange(city.name)
                        setOpen(false)
                      }}
                    >
                      {city.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                onLocationChange(null)
                setOpen(false)
              }}
            >
              Show All Locations
            </Button>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
