'use client'

import * as React from 'react'
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusIcon } from 'lucide-react'

interface Vaccine {
  id: number
  name: string
  manufacturer: string
  quantity: number
  expirationDate: string
}

export function AddVaccineComponent() {
  const [vaccines, setVaccines] = React.useState<Vaccine[]>([
    { id: 1, name: "COVID-19 Vaccine", manufacturer: "Pfizer", quantity: 1000, expirationDate: "2023-12-31" },
    { id: 2, name: "Flu Vaccine", manufacturer: "Moderna", quantity: 500, expirationDate: "2024-06-30" },
  ])
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [newVaccine, setNewVaccine] = React.useState<Omit<Vaccine, 'id'>>({
    name: '',
    manufacturer: '',
    quantity: 0,
    expirationDate: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewVaccine(prev => ({ ...prev, [name]: name === 'quantity' ? parseInt(value) : value }))
  }

  const handleAddVaccine = () => {
    setVaccines(prev => [...prev, { ...newVaccine, id: prev.length + 1 }])
    setNewVaccine({ name: '', manufacturer: '', quantity: 0, expirationDate: '' })
    setIsModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Add Vaccine</h1>
        
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Current Inventory</h2>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="mr-2 h-4 w-4" /> Add Vaccine
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white">
              <DialogHeader>
                <DialogTitle>Add New Vaccine</DialogTitle>
                <DialogDescription>
                  Enter the details of the new vaccine to add to the inventory.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={newVaccine.name}
                    onChange={handleInputChange}
                    className="col-span-3 bg-gray-800 text-white"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="manufacturer" className="text-right">
                    Manufacturer
                  </Label>
                  <Input
                    id="manufacturer"
                    name="manufacturer"
                    value={newVaccine.manufacturer}
                    onChange={handleInputChange}
                    className="col-span-3 bg-gray-800 text-white"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="quantity" className="text-right">
                    Quantity
                  </Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    value={newVaccine.quantity}
                    onChange={handleInputChange}
                    className="col-span-3 bg-gray-800 text-white"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="expirationDate" className="text-right">
                    Expiration Date
                  </Label>
                  <Input
                    id="expirationDate"
                    name="expirationDate"
                    type="date"
                    value={newVaccine.expirationDate}
                    onChange={handleInputChange}
                    className="col-span-3 bg-gray-800 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleAddVaccine}>Add Vaccine</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="rounded-md border border-gray-800">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-white">Name</TableHead>
                <TableHead className="text-white">Manufacturer</TableHead>
                <TableHead className="text-white">Quantity</TableHead>
                <TableHead className="text-white">Expiration Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vaccines.map((vaccine) => (
                <TableRow key={vaccine.id}>
                  <TableCell className="font-medium">{vaccine.name}</TableCell>
                  <TableCell>{vaccine.manufacturer}</TableCell>
                  <TableCell>{vaccine.quantity}</TableCell>
                  <TableCell>{vaccine.expirationDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}