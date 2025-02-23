<?php

namespace App\Repositories;

use App\Models\User;
use App\Models\UserPreference;
use App\Repositories\Interfaces\UserPreferenceRepositoryInterface;

class UserPreferenceRepository implements UserPreferenceRepositoryInterface
{
    public function updatePreferences(User $user, array $preferences)
    {
        $user->preferences()->delete();

        $insertData = [];
        foreach ($preferences as $type => $values) {
            foreach ($values as $value) {
                $insertData[] = [
                    'user_id' => $user->id,
                    'type' => $type,
                    'value' => $value,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        if (!empty($insertData)) {
            UserPreference::insert($insertData);
        }

        return $this->getPreferences($user);
    }

    public function getPreferences(User $user)
    {
        return $user->preferences->groupBy('type')->map(fn ($group) => $group->pluck('value')->toArray());
    }
}
