import { useVirtualizer } from '@tanstack/react-virtual';
import { useMemo, useRef } from 'react';
import type { GeoItem } from '../../store/filtersSlice';
import './GeoDropdown.css';

export type GeoDropdownProps = {
    isOpen: boolean;
    isLoading: boolean;
    error: unknown;
    items: GeoItem[];
    showEmpty: boolean;
    onSelect: (item: GeoItem) => void;
};

function getItemIcon(type: string) {
    switch (type) {
        case 'country':
            return '🌍';
        case 'city':
            return '🏙️';
        case 'hotel':
            return '🏨';
        default:
            return '📍';
    }
}

function GeoDropdown({
    isOpen,
    isLoading,
    error,
    items,
    showEmpty,
    onSelect,
}: GeoDropdownProps) {
    const parentRef = useRef<HTMLDivElement>(null);

    const count = items.length;
    const virtualizer = useVirtualizer({
        count,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 50,
        overscan: 5,
    });

    const virtualItems = virtualizer.getVirtualItems();
    const totalSize = virtualizer.getTotalSize();

    const content = useMemo(() => {
        if (!isOpen) return null;

        return (
            <div className="dropdown">
                {isLoading && (
                    <div className="dropdown-item dropdown-loading">
                        Завантаження...
                    </div>
                )}
                {!!error && (
                    <div className="dropdown-item dropdown-error">
                        Помилка завантаження
                    </div>
                )}
                {count > 0 && (
                    <div
                        ref={parentRef}
                        className="dropdown-virtual-container"
                        style={{ height: '200px', overflow: 'auto' }}
                    >
                        <div
                            style={{
                                height: `${totalSize}px`,
                                width: '100%',
                                position: 'relative',
                            }}
                        >
                            {virtualItems.map((virtualItem) => {
                                const item = items[virtualItem.index];

                                return (
                                    <div
                                        key={item.id ?? virtualItem.index}
                                        className="dropdown-item"
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => onSelect(item)}
                                        onKeyDown={(e) => {
                                            if (
                                                e.key === 'Enter' ||
                                                e.key === ' '
                                            ) {
                                                e.preventDefault();
                                                onSelect(item);
                                            }
                                        }}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: `${virtualItem.size}px`,
                                            transform: `translateY(${virtualItem.start}px)`,
                                        }}
                                    >
                                        <div className="item-content">
                                            <span className="item-icon">
                                                {item.type === 'country' &&
                                                item?.flag &&
                                                item.flag.length > 0 ? (
                                                    <img
                                                        src={item.flag}
                                                        alt={item.name}
                                                        width={20}
                                                        height={20}
                                                    />
                                                ) : (
                                                    getItemIcon(item.type)
                                                )}
                                            </span>
                                            <span className="item-name">
                                                {item.name}
                                            </span>
                                        </div>
                                        <span className="item-type">
                                            {(() => {
                                                switch (item.type) {
                                                    case 'country':
                                                        return 'Країна';
                                                    case 'city':
                                                        return 'Місто';
                                                    default:
                                                        return 'Готель';
                                                }
                                            })()}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                {showEmpty && (
                    <div className="dropdown-item dropdown-empty">
                        Нічого не знайдено
                    </div>
                )}
            </div>
        );
    }, [
        isOpen,
        isLoading,
        error,
        count,
        items,
        virtualItems,
        totalSize,
        onSelect,
        showEmpty,
    ]);

    return content;
}

export default GeoDropdown;
