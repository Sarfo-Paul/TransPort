import { Vehicle, Shipment, Driver } from './types';

export const vehicles: Vehicle[] = [
  { id: 'V1', make: 'Freightliner', model: 'Cascadia', year: 2022, licensePlate: 'TX-9821', status: 'active', fuelLevel: 85, mileage: 45000, lastService: '2024-01-15', type: 'Truck' },
  { id: 'V2', make: 'Volvo', model: 'VNL 860', year: 2023, licensePlate: 'CA-4412', status: 'active', fuelLevel: 42, mileage: 12000, lastService: '2024-02-10', type: 'Truck' },
  { id: 'V3', make: 'Mercedes-Benz', model: 'Sprinter', year: 2021, licensePlate: 'NY-7733', status: 'maintenance', fuelLevel: 10, mileage: 88000, lastService: '2024-02-20', type: 'Van' },
  { id: 'V4', make: 'Ford', model: 'Transit', year: 2022, licensePlate: 'FL-2290', status: 'idle', fuelLevel: 95, mileage: 31000, lastService: '2023-12-05', type: 'Van' },
  { id: 'V5', make: 'Kenworth', model: 'T680', year: 2024, licensePlate: 'WA-1104', status: 'active', fuelLevel: 68, mileage: 5000, lastService: '2024-02-01', type: 'Truck' },
];

export const shipments: Shipment[] = [
  { id: 'S101', origin: 'Houston, TX', destination: 'Chicago, IL', status: 'in-transit', priority: 'high', estimatedArrival: '2024-02-25T14:00:00Z', assignedVehicleId: 'V1', assignedDriverId: 'D1', cargo: 'Electronics', weight: 12000 },
  { id: 'S102', origin: 'Los Angeles, CA', destination: 'Phoenix, AZ', status: 'pending', priority: 'medium', estimatedArrival: '2024-02-26T09:00:00Z', cargo: 'Furniture', weight: 8500 },
  { id: 'S103', origin: 'Miami, FL', destination: 'Atlanta, GA', status: 'delayed', priority: 'high', estimatedArrival: '2024-02-24T18:00:00Z', assignedVehicleId: 'V2', assignedDriverId: 'D2', cargo: 'Perishables', weight: 5000 },
  { id: 'S104', origin: 'Seattle, WA', destination: 'Denver, CO', status: 'delivered', priority: 'low', estimatedArrival: '2024-02-23T16:30:00Z', assignedVehicleId: 'V5', assignedDriverId: 'D3', cargo: 'Textiles', weight: 15000 },
];

export const drivers: Driver[] = [
  { id: 'D1', name: 'John Doe', status: 'on-duty', rating: 4.8, totalTrips: 154, licenseNumber: 'DL-99881', phone: '555-0101', avatar: 'https://i.pravatar.cc/150?u=D1' },
  { id: 'D2', name: 'Jane Smith', status: 'on-duty', rating: 4.9, totalTrips: 210, licenseNumber: 'DL-77223', phone: '555-0102', avatar: 'https://i.pravatar.cc/150?u=D2' },
  { id: 'D3', name: 'Mike Johnson', status: 'break', rating: 4.5, totalTrips: 98, licenseNumber: 'DL-44556', phone: '555-0103', avatar: 'https://i.pravatar.cc/150?u=D3' },
  { id: 'D4', name: 'Sarah Wilson', status: 'off-duty', rating: 4.7, totalTrips: 132, licenseNumber: 'DL-11223', phone: '555-0104', avatar: 'https://i.pravatar.cc/150?u=D4' },
];

export const performanceData = [
  { name: 'Mon', fuel: 400, deliveries: 24 },
  { name: 'Tue', fuel: 300, deliveries: 18 },
  { name: 'Wed', fuel: 500, deliveries: 32 },
  { name: 'Thu', fuel: 280, deliveries: 20 },
  { name: 'Fri', fuel: 590, deliveries: 45 },
  { name: 'Sat', fuel: 200, deliveries: 15 },
  { name: 'Sun', fuel: 150, deliveries: 10 },
];
