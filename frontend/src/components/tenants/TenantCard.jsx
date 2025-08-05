import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import {
  Building2,
  MoreHorizontal,
  Edit3,
  Trash2,
  Pause,
  Play,
  Eye,
  Globe,
  Users,
  DollarSign,
  Calendar,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

const TenantCard = ({ tenant, onEdit, onDelete, onToggleStatus, onView }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const getStatusConfig = (status) => {
    const configs = {
      active: { 
        color: 'bg-emerald-100 text-emerald-700 border-emerald-200', 
        icon: '🟢', 
        label: 'Active' 
      },
      suspended: { 
        color: 'bg-yellow-100 text-yellow-700 border-yellow-200', 
        icon: '🟡', 
        label: 'Suspended' 
      },
      pending: { 
        color: 'bg-blue-100 text-blue-700 border-blue-200', 
        icon: '🔵', 
        label: 'Pending' 
      },
      inactive: { 
        color: 'bg-red-100 text-red-700 border-red-200', 
        icon: '🔴', 
        label: 'Inactive' 
      }
    };
    return configs[status] || configs.pending;
  };

  const getBusinessTypeIcon = (type) => {
    const icons = {
      restaurant: '🍽️',
      grocery: '🥬',
      pharmacy: '💊',
      electronics: '📱',
      fashion: '👕',
      books: '📚',
      home_garden: '🏡',
      health_beauty: '💄',
      sports: '⚽',
      other: '🏪'
    };
    return icons[type] || '🏪';
  };

  const getPlanConfig = (plan) => {
    const configs = {
      Basic: { color: 'bg-slate-100 text-slate-700', price: '$29/mo' },
      Professional: { color: 'bg-blue-100 text-blue-700', price: '$79/mo' },
      Enterprise: { color: 'bg-purple-100 text-purple-700', price: '$199/mo' }
    };
    return configs[plan] || configs.Basic;
  };

  const statusConfig = getStatusConfig(tenant.status);
  const planConfig = getPlanConfig(tenant.plan);

  const handleDeleteConfirm = () => {
    onDelete(tenant.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card className="group hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-0 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            {/* Tenant Avatar & Basic Info */}
            <div className="flex items-start gap-4">
              <Avatar className="w-14 h-14 shadow-lg ring-2 ring-white">
                <AvatarFallback className="bg-gradient-to-tr from-blue-600 to-green-600 text-white text-lg font-bold">
                  {getBusinessTypeIcon(tenant.businessType)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg text-slate-900 truncate">
                    {tenant.name}
                  </h3>
                  <Badge className={`${statusConfig.color} border text-xs font-medium`}>
                    {statusConfig.icon} {statusConfig.label}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                  <Globe className="w-4 h-4" />
                  <span className="truncate">{tenant.domain}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Building2 className="w-4 h-4" />
                  <span className="capitalize">{tenant.businessType?.replace('_', ' ')}</span>
                </div>
              </div>
            </div>

            {/* Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-100 rounded-lg"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onView(tenant)} className="cursor-pointer">
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(tenant)} className="cursor-pointer">
                  <Edit3 className="mr-2 h-4 w-4" />
                  Edit Tenant
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onToggleStatus(tenant.id, tenant.status === 'active' ? 'suspended' : 'active')}
                  className="cursor-pointer"
                >
                  {tenant.status === 'active' ? (
                    <>
                      <Pause className="mr-2 h-4 w-4" />
                      Suspend Tenant
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Activate Tenant
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setShowDeleteDialog(true)}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Tenant
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Contact Information */}
          <div className="space-y-3 mb-4">
            {tenant.email && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail className="w-4 h-4" />
                <span className="truncate">{tenant.email}</span>
              </div>
            )}
            
            {tenant.phone && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone className="w-4 h-4" />
                <span>{tenant.phone}</span>
              </div>
            )}

            {(tenant.city || tenant.state) && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin className="w-4 h-4" />
                <span>{[tenant.city, tenant.state].filter(Boolean).join(', ')}</span>
              </div>
            )}
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 py-3 border-t border-slate-100">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-blue-600">
                <Users className="w-4 h-4" />
                <span className="font-semibold text-lg">{tenant.users || 0}</span>
              </div>
              <p className="text-xs text-slate-500">Users</p>
            </div>
            
            <div className="text-center border-l border-r border-slate-100">
              <div className="flex items-center justify-center gap-1 text-green-600">
                <DollarSign className="w-4 h-4" />
                <span className="font-semibold text-lg">
                  ${(tenant.monthlyRevenue || 0).toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-slate-500">Monthly</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-purple-600">
                <Calendar className="w-4 h-4" />
                <span className="font-semibold text-sm">
                  {tenant.createdAt}
                </span>
              </div>
              <p className="text-xs text-slate-500">Joined</p>
            </div>
          </div>

          {/* Plan & Last Active */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
            <Badge className={`${planConfig.color} border-0 font-medium`}>
              {tenant.plan} {planConfig.price}
            </Badge>
            
            <div className="text-xs text-slate-500">
              Last active: {tenant.lastActive || 'Never'}
            </div>
          </div>

          {/* Description (if available) */}
          {tenant.description && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <p className="text-sm text-slate-600 line-clamp-2">
                {tenant.description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tenant</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{tenant.name}</strong>? 
              This action cannot be undone and will remove all associated data including:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>All tenant users and their data</li>
                <li>Products and inventory</li>
                <li>Order history</li>
                <li>Analytics and reports</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Tenant
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TenantCard;