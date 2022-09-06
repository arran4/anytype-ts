import * as React from 'react';
import { I } from 'Lib';
import { observer } from 'mobx-react';
import { dbStore } from 'Store';

import Cell from './cell';

interface Props extends I.ViewComponent {
	index: number;
	style?: any;
	cellPosition?: (cellId: string) => void;
	onRef?(ref: any, id: string): void;
};

const BodyRow = observer(class BodyRow extends React.Component<Props, {}> {

	render () {
		const { rootId, block, index, getView, getRecord, style, onContext } = this.props;
		const view = getView();
		const relations = view.relations.filter((it: any) => { 
			return it.isVisible && dbStore.getRelation(rootId, block.id, it.relationKey); 
		});
		const columns = relations.map(it => it.width + 'px').concat([ 'auto' ]);
		const record = getRecord(index);
		const cn = [ 'row' ];

		if ((record.layout == I.ObjectLayout.Task) && record.done) {
			cn.push('isDone');
		};
		if (record.isArchived) {
			cn.push('isArchived');
		};
		if (record.isDeleted) {
			cn.push('isDeleted');
		};

		return (
			<div 
				id={'row-' + index} 
				className={cn.join(' ')} 
				style={style} 
				onContextMenu={(e: any) => { onContext(e, record.id); }}
			>
				<div 
					id={'selectable-' + record.id} 
					className={[ 'selectable', 'type-' + I.SelectType.Record ].join(' ')} 
					data-id={record.id}
					data-type={I.SelectType.Record}
					style={{ gridTemplateColumns: columns.join(' ') }}
				>
					{relations.map((relation: any, i: number) => (
						<Cell 
							key={'grid-cell-' + relation.relationKey + record.id} 
							{...this.props}
							width={relation.width}
							index={index} 
							relationKey={relation.relationKey} 
							className={`index${i}`}
						/>
					))}
					<div className="cell last" />
				</div>
			</div>
		);
	};

});

export default BodyRow;