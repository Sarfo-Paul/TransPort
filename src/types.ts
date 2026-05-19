export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  status: 'active' | 'maintenance' | 'idle';
  fuelLevel: number;
  mileage: number;
  lastService: string;
  type: 'Truck' | 'Van' | 'Car';
}

export interface Shipment {
  id: string;
  origin: string;
  destination: string;
  status: 'pending' | 'in-transit' | 'delivered' | 'delayed';
  priority: 'low' | 'medium' | 'high';
  estimatedArrival: string;
  assignedVehicleId?: string;
  assignedDriverId?: string;
  cargo: string;
  weight: number;
}

export interface Driver {
  id: string;
  name: string;
  status: 'on-duty' | 'off-duty' | 'break';
  rating: number;
  totalTrips: number;
  licenseNumber: string;
  phone: string;
  avatar: string;
}

export interface DashboardStats {
  activeVehicles: number;
  pendingShipments: number;
  totalRevenue: number;
  fuelEfficiency: number;
}
