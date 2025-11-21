import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface ActivityLogEntry {
  id: string;
  action_type: string;
  action_details: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export function ActivityLog() {
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, searchTerm, filterType]);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = logs;

    if (filterType !== 'all') {
      filtered = filtered.filter(log => log.action_type === filterType);
    }

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.action_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action_details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ip_address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLogs(filtered);
  };

  const getActionBadgeColor = (actionType: string) => {
    if (actionType.includes('login')) return 'default';
    if (actionType.includes('password')) return 'destructive';
    if (actionType.includes('profile')) return 'secondary';
    if (actionType.includes('role')) return 'outline';
    return 'default';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity History</CardTitle>
        <CardDescription>View your recent account activity</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Input
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activities</SelectItem>
              <SelectItem value="login">Login</SelectItem>
              <SelectItem value="profile_update">Profile Updates</SelectItem>
              <SelectItem value="password_change">Password Changes</SelectItem>
              <SelectItem value="role_change">Role Changes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {filteredLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No activity logs found</p>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant={getActionBadgeColor(log.action_type)}>
                    {log.action_type.replace(/_/g, ' ').toUpperCase()}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>
                {log.action_details && (
                  <p className="text-sm">{log.action_details}</p>
                )}
                <div className="flex gap-4 text-xs text-muted-foreground">
                  {log.ip_address && <span>IP: {log.ip_address}</span>}
                  {log.user_agent && (
                    <span className="truncate max-w-xs" title={log.user_agent}>
                      {log.user_agent}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
