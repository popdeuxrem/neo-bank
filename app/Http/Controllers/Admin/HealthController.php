<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Queue;
use Inertia\Inertia;
use Inertia\Response;

class HealthController extends Controller
{
    /**
     * Get system health stats.
     */
    public function getStats(): JsonResponse
    {
        $cacheKey = 'system_health_stats';
        $cacheTtl = 5; // seconds

        $stats = Cache::remember($cacheKey, $cacheTtl, function () {
            return $this->fetchStats();
        });

        return response()->json($stats);
    }

    /**
     * Fetch all system stats.
     */
    protected function fetchStats(): array
    {
        // CPU Load
        $loadAvg = sys_getloadavg();
        $cpuLoad = [
            '1min' => $loadAvg[0] ?? 0,
            '5min' => $loadAvg[1] ?? 0,
            '15min' => $loadAvg[2] ?? 0,
            'percentage' => $this->calculateCpuPercentage($loadAvg[0] ?? 0),
        ];

        // Memory Usage
        $memoryUsage = $this->getMemoryUsage();

        // Queue Status
        $queueStatus = $this->getQueueStatus();

        // Database Connections
        $dbStatus = $this->getDatabaseStatus();

        // Overall Health Score
        $healthScore = $this->calculateHealthScore($cpuLoad, $memoryUsage, $queueStatus, $dbStatus);

        return [
            'cpu' => $cpuLoad,
            'memory' => $memoryUsage,
            'queues' => $queueStatus,
            'database' => $dbStatus,
            'health_score' => $healthScore,
            'status' => $this->getStatusFromScore($healthScore),
            'timestamp' => now()->toIso8601String(),
        ];
    }

    /**
     * Calculate CPU percentage (simplified).
     */
    protected function calculateCpuPercentage(float $load): float
    {
        // Assuming a system with 4 cores, normalize to percentage
        $cores = 4;
        $percentage = ($load / $cores) * 100;

        return min(100, round($percentage, 1));
    }

    /**
     * Get memory usage information.
     */
    protected function getMemoryUsage(): array
    {
        $phpMemory = [
            'used' => memory_get_usage(true),
            'peak' => memory_get_peak_usage(true),
        ];

        // For system memory, we'll use a fallback since it's platform-dependent
        $systemMemory = [
            'total' => 8 * 1024 * 1024 * 1024, // 8GB fallback
            'used' => 4 * 1024 * 1024 * 1024,  // 4GB fallback
            'free' => 4 * 1024 * 1024 * 1024,   // 4GB fallback
        ];

        // Try to get actual system memory on Linux
        if (file_exists('/proc/meminfo')) {
            $memInfo = file_get_contents('/proc/meminfo');
            preg_match('/MemTotal:\s+(\d+)/', $memInfo, $total);
            preg_match('/MemAvailable:\s+(\d+)/', $memInfo, $available);

            if (! empty($total[1])) {
                $systemMemory['total'] = (int) $total[1] * 1024; // Convert KB to bytes
                $systemMemory['free'] = ! empty($available[1]) ? (int) $available[1] * 1024 : 0;
                $systemMemory['used'] = $systemMemory['total'] - $systemMemory['free'];
            }
        }

        return [
            'php' => $phpMemory,
            'system' => $systemMemory,
            'percentage' => round(($systemMemory['used'] / $systemMemory['total']) * 100, 1),
        ];
    }

    /**
     * Get queue status for various queues.
     */
    protected function getQueueStatus(): array
    {
        $queues = ['default', 'broadcasts', 'fraud'];
        $queueData = [];

        foreach ($queues as $queue) {
            // Note: In production, you'd use Redis or database to get actual counts
            // This is a simplified version
            $queueData[$queue] = [
                'pending' => rand(0, 20), // Demo data - replace with actual queue check
                'failed' => rand(0, 2),    // Demo data
                'delayed' => rand(0, 5),   // Demo data
            ];
        }

        $totalPending = array_sum(array_column($queueData, 'pending'));
        $totalFailed = array_sum(array_column($queueData, 'failed'));

        return [
            'queues' => $queueData,
            'total_pending' => $totalPending,
            'total_failed' => $totalFailed,
        ];
    }

    /**
     * Get database connection status.
     */
    protected function getDatabaseStatus(): array
    {
        try {
            $start = microtime(true);
            DB::connection()->getPdo();
            $responseTime = round((microtime(true) - $start) * 1000, 2); // ms

            return [
                'connected' => true,
                'response_time_ms' => $responseTime,
                'database' => config('database.connections.'.config('database.default').'.database'),
            ];
        } catch (\Exception $e) {
            return [
                'connected' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Calculate overall health score (0-100).
     */
    protected function calculateHealthScore(array $cpu, array $memory, array $queues, array $db): int
    {
        $score = 100;

        // Deduct for high CPU (above 70%)
        if ($cpu['percentage'] > 70) {
            $score -= min(30, ($cpu['percentage'] - 70) * 2);
        }

        // Deduct for high memory (above 80%)
        if ($memory['percentage'] > 80) {
            $score -= min(30, ($memory['percentage'] - 80) * 2);
        }

        // Deduct for failed jobs
        $score -= min(20, $queues['total_failed'] * 5);

        // Deduct for slow database
        if ($db['connected'] && $db['response_time_ms'] > 500) {
            $score -= min(20, ($db['response_time_ms'] - 500) / 50);
        }

        // Deduct for disconnected database
        if (! $db['connected']) {
            $score -= 50;
        }

        return max(0, (int) $score);
    }

    /**
     * Get status label from health score.
     */
    protected function getStatusFromScore(int $score): string
    {
        if ($score >= 80) {
            return 'healthy';
        }
        if ($score >= 50) {
            return 'degraded';
        }

        return 'critical';
    }

    /**
     * Restart queues (mock endpoint for demo).
     */
    public function restartQueue(): JsonResponse
    {
        // In production, this would actually restart the queue workers
        // For demo purposes, we'll just return a success response

        return response()->json([
            'message' => 'Queue restart command sent',
            'timestamp' => now()->toIso8601String(),
        ]);
    }

    public function info(): Response
    {
        $stats = $this->fetchStats();

        return Inertia::render('admin/system/info', [
            'stats' => $stats,
        ]);
    }

    public function clearCache(): JsonResponse
    {
        try {
            Cache::flush();

            return response()->json([
                'message' => 'Cache cleared successfully',
                'timestamp' => now()->toIso8601String(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to clear cache',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
