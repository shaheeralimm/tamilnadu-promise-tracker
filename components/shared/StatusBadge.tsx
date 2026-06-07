import React from "react"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react"
import { Status } from "@/types"

interface StatusBadgeProps {
  status: Status
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  switch (status) {
    case "fulfilled":
      return (
        <Badge variant="outline" className={`bg-tvk-green-bg text-tvk-green border-tvk-green/20 ${className}`}>
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Fulfilled
        </Badge>
      )
    case "in-progress":
      return (
        <Badge variant="outline" className={`bg-tvk-blue-bg text-tvk-blue border-tvk-blue/20 relative overflow-hidden ${className}`}>
          <span className="absolute inset-0 bg-tvk-blue/10 animate-pulse" />
          <Clock className="mr-1 h-3 w-3 z-10" />
          <span className="z-10">In Progress</span>
        </Badge>
      )
    case "evaded":
      return (
        <Badge variant="outline" className={`bg-red-50 text-evaded border-evaded/20 ${className}`}>
          <XCircle className="mr-1 h-3 w-3" />
          Evaded
        </Badge>
      )
    case "pending":
    default:
      return (
        <Badge variant="outline" className={`bg-gray-50 text-pending border-pending/20 ${className}`}>
          <AlertCircle className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      )
  }
}
