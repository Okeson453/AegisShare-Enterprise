import { ReactNode } from 'react'
import { Reorder } from 'framer-motion'

interface DraggableListProps<T extends { id: string }> {
  items: T[]
  onReorder: (items: T[]) => void
  renderItem: (item: T, index: number) => ReactNode
  isDragDisabled?: boolean
}

export const DraggableList = <T extends { id: string }>({
  items,
  onReorder,
  renderItem,
  isDragDisabled = false,
}: DraggableListProps<T>) => {
  return (
    <Reorder.Group
      axis="y"
      values={items}
      onReorder={onReorder}
      as="div"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      {items.map((item, index) => (
        <Reorder.Item
          key={item.id}
          value={item}
          drag={!isDragDisabled ? 'y' : false}
          dragElastic={0.2}
          whileHover={{ scale: 1.01 }}
          whileDrag={{ scale: 1.02, opacity: 0.8, zIndex: 1000 }}
          style={{
            cursor: isDragDisabled ? 'default' : 'grab',
            touchAction: 'none',
          }}
        >
          {renderItem(item, index)}
        </Reorder.Item>
      ))}
    </Reorder.Group>
  )
}
